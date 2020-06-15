const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    stocks: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: [],
    folder: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    images: [],
    sold: { type: Number }
})

module.exports = Product = mongoose.model('product', ProductSchema)