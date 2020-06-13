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
    if(!req.session.user) 
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
router.post('/charge', (req, res) => {
    const token = req.body.stripeToken;
    const amount = req.body.amount;

    (async () => {
        const charge = await stripe.charges.create({
            amount,
            currency: 'inr',
            description: 'Example Charge',
            source: token,
        })
        if(charge.status == 'succeeded') 
            res.send('success')
    })();
})


module.exports = router