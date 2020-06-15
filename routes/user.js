const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const path = require('path')

const app = express()
const User = require('../models/User')
const Product = require('../models/Product')
const Purchase = require('../models/Purchased')
const Wishlist = require('../models/Wishlist')
const Cart = require('../models/Cart')

// for body parser
app.use(express.urlencoded({ extended: false }))

// setting the static folder
app.use(express.static(path.join(__dirname, 'public')))

// setting the views folder
app.set('views', path.join(__dirname, 'views'))

// logout request 
router.get('/logout', (req, res, next) => {
    if (req.session.user)
        req.session.destroy(() => res.redirect('/'))
    else
        res.redirect('/')
})

// login page user render
router.get('/', (req, res) => {
    if (!req.session.user)
        return res.render('user/Login', {
            title: 'Login - E-Commerce',
            action: 'auth_form user',
            error: ''
        })
    res.redirect('/home')
})

// verfying and logging in user
router.post('/login', async (req, res) => {
    const { email, password } = req.body
    try {
        let user = await User.findOne({ email })
        if (!user)
            return res.render('user/Login', {
                title: 'Login - E-Commerce',
                action: 'auth_form user',
                error: 'User does not exists.'
            })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch)
            return res.render('user/Login', {
                title: 'Login - E-Commerce',
                action: 'auth_form user',
                error: 'Invalid Credentials'
            })

        req.session.user = user
        res.redirect('/product/purchased/list')
    }
    catch (err) {
        console.log(err)
        res.send(err.message)
    }
})

// signup page user 
router.get('/signup', (req, res) => {
    if (!req.session.user)
        return res.render('user/Register', {
            title: 'Signup - E-Commerce',
            action: 'auth_form user',
            error: ''
        })
    res.redirect('/home')
})

// verfying and signing in user
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body

    try {
        let user = await User.findOne({ email })
        if (user)
            return res.render('user/Register', {
                title: 'Signup - E-Commerce',
                action: 'auth_form user',
                error: 'User Already exixts'
            })

        user = new User({
            name,
            email,
            password
        })

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)

        await user.save()
        req.session.user = user
        res.send(`Hello signup ${user.name}`)
    }
    catch (err) {
        console.log(err)
        res.send(err.message)
    }
})

// home page for users
router.get('/home', (req, res) => {
    if (req.session.user) {
        return res.render('user/Home', {
            title: 'Home - E-commerce',
            user: req.session.user
        })
    }
    res.redirect('/')
})

// get product by name
router.get('/search/product', async (req, res) => {
    const { key, category } = req.query
    // if key is empty then search on the basis of the selected category
    if (key === '') {
        try {
            const product = await Product.find({ category })
            if (!product)
                return res.json({ msg: `Nothing found for ${category}` })
            return res.json(product)
        }
        catch (err) {
            console.log(err)
            return res.json({ msg: 'Server Error' })
        }

    }
    // if category is empty then search on the basis of the key entered
    if (category === '') {
        try {
            const product = await Product.find({ name: { $eq: key } })
            if (!product)
                return res.json({ msg: `Nothing can be found` })
            return res.json(product)
        }
        catch (err) {
            console.log(err)
            return res.json({ msg: 'Server Error' })
        }

    }

    try {
        const product = await Product.find({ $and: [{ category }, { name: { $eq: key } }] })

        if (!product)
            return res.json({ msg: `Nothing can be found` })
        res.json(product)
    }
    catch (err) {
        console.log(err)
        return res.json({ msg: 'Server Error' })
    }

})

// get the products page
router.get('/product/:name', async (req, res) => {
    if (!req.session.user)
        return res.redirect('/')

    const id = req.query['r']

    try {
        const product = await Product.findById(id)
        if (!product)
            return res.render('user/Product', {
                title: req.params.name,
                user: req.session.user,
                error: 'No Product Found',
                product: {}
            })

        return res.render('user/Product', {
            title: req.params.name,
            user: req.session.user,
            error: '',
            product
        })
    }
    catch (err) {
        console.log(err)
        res.render('user/Product', {
            title: req.params.name,
            user: req.session.user,
            error: 'Server Error',
            product: {}
        })
    }
})

// get the cart page
router.get('/cart', async (req, res) => {
    if (req.session.user) {
        try {
            const data = await Cart.findOne({ user: req.session.user._id })

            if (!data) {
                return res.render('user/Cart', {
                    title: 'Your Cart',
                    user: req.session.user,
                    msg: 'No Products On Your Cart..'
                })
            }

            const { items } = data
            const products = await Product.find({ "_id": { $in: items } })

            return res.render('user/Cart', {
                title: 'Your Cart',
                user: req.session.user,
                products,
                msg: products.length ? '' : 'No Products On Your Cart..'
            })
        }
        catch (err) {
            console.log(err)
            return res.render('user/Cart', {
                title: 'Your Cart',
                user: req.session.user,
                msg: 'Server Error. Cannot get your cart'
            })
        }
    }
    res.redirect('/')
})

// get the wishlist page
router.get('/wishlist', async (req, res) => {
    if (req.session.user) {
        try {
            const data = await Wishlist.findOne({ user: req.session.user._id })
            if (!data) {
                return res.render('user/Wishlist', {
                    title: 'Your wishlist',
                    user: req.session.user,
                    msg: 'No Products On Your Wishlist..'
                })
            }

            const { items } = data
            const products = await Product.find({ "_id": { $in: items } })

            return res.render('user/Wishlist', {
                title: 'Your wishlist',
                user: req.session.user,
                products,
                msg: products.length ? '' : 'No Products On Your Wishlist..'
            })
        }
        catch (err) {
            console.log(err)
            return res.render('user/Wishlist', {
                title: 'Your wishlist',
                user: req.session.user,
                msg: 'Server Error. Cannot get your wishlist'
            })
        }
    }
    res.redirect('/')
})

// get the purchased product list
router.get('/product/purchased/list', async (req, res) => {
    if (!req.session.user)
        return res.redirect('/')

    try {
        const purchase = await Purchase.findOne({ user: req.session.user._id })
        if (!purchase)
            return res.render({
                title: 'Products Purchased',
                user: req.session.user,
                error: 'No Items Bought Yet!',
                products: [],
                items: []
            })

        let productId = []
        purchase.items.forEach(item => productId.unshift(item.productId))

        const products = await Product.find({ "_id": { $in: productId } })

        res.render('user/Buy', {
            title: 'Products Purchased',
            user: req.session.user,
            error: '',
            products,
            items: purchase.items
        })
    }
    catch (err) {
        console.log(err)
        res.render('user/Buy', {
            title: 'Products Purchased',
            user: req.session.user,
            error: 'Server Error',
            products: [],
            items: []
        })
    }
})

module.exports = router