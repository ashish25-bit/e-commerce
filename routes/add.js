const express = require('express')
const router = express.Router()
const path = require('path')

const app = express()
const Wishlist = require('../models/Wishlist')
const Cart = require('../models/Cart')

// for body parser
app.use(express.urlencoded({ extended: false }))

// setting the static folder
app.use(express.static(path.join(__dirname, 'public')))

// setting the views folder
app.set('views', path.join(__dirname, 'views'))

// api for adding to the wishlist
router.post('/wishlist/:id', async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.session.user._id })
        if(wishlist) {
            // if item is present then remove it from the wishlist
            if(wishlist.items.includes(req.params.id)) {
                let index = wishlist.items.indexOf(req.params.id)
                wishlist.items.splice(index, 1)
                await wishlist.save()
                return res.send('Removed from wishlist')
            }
            wishlist.items.push(req.params.id)
            await wishlist.save()
            return res.send('Added to wishlist')
        }

        const data = {
            user: req.session.user._id,
            items: [req.params.id]
        }
        
        wishlist = new Wishlist(data)
        await wishlist.save()
        res.send('Added to wishlist')
    } 
    catch (err) {
        console.log(err)
        res.send('Server Error')
    }
})

// api for adding to the cart
router.post('/cart/:id', async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.session.user._id })
        if(cart) {
            // if item is present then remove it from the wishlist
            if(cart.items.includes(req.params.id)) {
                let index = cart.items.indexOf(req.params.id)
                cart.items.splice(index, 1)
                await cart.save()
                return res.send('Removed from cart')
            }
            cart.items.push(req.params.id)
            await cart.save()
            return res.send('Added to cart')
        }

        const data = {
            user: req.session.user._id,
            items: [req.params.id]
        }
        
        cart = new Cart(data)
        await cart.save()
        res.send('Added to cart')
    } 
    catch (err) {
        console.log(err)
        res.send('Server Error')
    }
})

module.exports = router