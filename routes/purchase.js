if(process.env.NODE_ENV !== 'production' ) {
    require('dotenv').config()
}
const express = require('express')
const router = express.Router()
const path = require('path')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const app = express()
const Product = require('../models/Product')
const Purchase = require('../models/Purchased')
const authUser = require('../middleware/authUser')
const { customer } = require('../secret')

// for body parser
app.use(express.urlencoded({ extended: false }))

// setting the static folder
app.use(express.static(path.join(__dirname, 'public')))

// setting the views folder
app.set('views', path.join(__dirname, 'views'))


// purchase page
router.get('/:name', authUser, async (req, res) => {
    if (!req.session.user)
        return res.redirect('/')

    const id = req.query['r']

    try {
        const product = await Product.findById(id)
        if (!product)
            return res.render('user/Purchase', {
                title: req.params.name,
                user: req.session.user,
                error: 'No Product Found',
                product: {}, 
                msg: '',
                publicKey: process.env.STRIPE_PUBLIC_KEY,
                referrer: customer
            })

        return res.render('user/Purchase', {
            title: req.params.name,
            user: req.session.user,
            error: '',
            product,
            msg: '',
            publicKey: process.env.STRIPE_PUBLIC_KEY,
            referrer: customer
        })
    }
    catch (err) {
        console.log(err)
        res.render('user/Purchase', {
            title: req.params.name,
            user: req.session.user,
            error: 'Server Error',
            product: {},
            msg: '',
            publicKey: process.env.STRIPE_PUBLIC_KEY,
            referrer: customer
        })
    }
})

// charge
router.post('/charge', async (req, res) => {
    const { stripeToken, id, quantity, ...details } = req.body

    try {
        const product = await Product.findById(id)

        if (!product)
            return res.redirect('/product/puchased/list')

        // check for the number of stocks according to the asked quantity
        if(product.stocks >= quantity) {
            let fee = quantity * product.price * 0.0354 * 100
    
            const charge = await stripe.charges.create({
                amount: (product.price * 100 * quantity) + fee,
                currency: 'inr',
                description: `${quantity} ${product.name} bought by ${req.session.user.name}`,
                source: stripeToken,
            })
    
            if (charge.status == 'succeeded') {
                // change the number of stocks 
                product.stocks -= quantity
                product.sold += quantity 
                await product.save()
                
                // add the item to the purchased collection 
                details.productId = product._id
                details.status = 'Order Placed'
                details.payment = charge.source.brand 
                details.pincode = parseInt(charge.billing_details.address.postal_code)
                let profile = await Purchase.findOne({ user: req.session.user._id })

                if(profile) {
                    profile.items.unshift(details)
                    profile.save()
                }

                else {
                    const data = {
                        user: req.session.user._id,
                        items: [details]
                    }

                    profile = new Purchase(data)
                    profile.save()
                }
                return res.redirect(`/product/purchased/list?referrer=${customer}`)
            }

            return res.render('user/Purchase', {
                title: req.params.name,
                user: req.session.user,
                error: '',
                product,
                msg: 'Error in purchasing the product',
                referrer: customer
            })

        }

        res.render('user/Purchase', {
            title: req.params.name,
            user: req.session.user,
            error: '',
            product,
            msg: `${quantity} stocks of this product is not available.`,
            referrer: customer
        })

    }
    catch (err) {
        console.log(err)
        res.redirect(`/product/purchased/list?referrer=${customer}`)
    }
})


module.exports = router