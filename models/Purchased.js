const mongoose = require('mongoose')

const PurchaseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    items: [
        {
            productId: { type: String, required: true },
            status: { type: String },
            name: { type: String, required: true },
            mobile: { type: Number, required: true },
            pincode: { type: Number, required: true },
            address: { type: String, required: true },
            payment: { type: String, require: true } 
            // payment online or cash on delivery
        }
    ]
})

module.exports = Purchase = mongoose.model('purchase', PurchaseSchema)