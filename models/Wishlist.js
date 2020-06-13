const mongoose = require('mongoose')

const WishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    items: []
})

module.exports = Wishlist = mongoose.model('wishlist', WishlistSchema)