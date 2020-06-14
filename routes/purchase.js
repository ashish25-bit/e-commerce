const express = require('express')
const router = express.Router()
const path = require('path')
const stripe = require('stripe')('STRIPE_SECRET_KEY')

const app = express()
const Product = require('../models/Product')

// for body parser
app.use(express.urlencoded({ extended: false }))

// setting the static folder
app.use(express.static(path.join(__dirname, 'public')))

// setting the views folder
app.set('views', path.join(__dirname, 'views'))


// purchase page
router.get('/:name', async (req, res) => {
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
                product: {}
            })

        return res.render('user/Purchase', {
            title: req.params.name,
            user: req.session.user,
            error: '',
            product
        })
    }
    catch (err) {
        console.log(err)
        res.render('user/Purchase', {
            title: req.params.name,
            user: req.session.user,
            error: 'Server Error',
            product: {}
        })
    }
})

// charge
router.post('/charge', async (req, res) => {
    const { stripeToken, id, quantity } = req.body

    try {

        const product = await Product.findById(id)

        if (!product)
            return res.redirect('/home')

        let fee = quantity * product.price * 0.0354 * 100

        const charge = await stripe.charges.create({
            amount: (product.price * 100 * quantity) + fee,
            currency: 'inr',
            description: `${quantity} ${product.name} bought by ${req.session.user.name}`,
            source: stripeToken,
        })

        if (charge.status == 'succeeded')
            res.redirect('/home')
    }
    catch (err) {
        console.log(err)
        res.redirect('/home')
    }
})


module.exports = router