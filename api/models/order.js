const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    produtoMongoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantidade: { type: Number, default: 1 }
});

module.exports = mongoose.model('Order', orderSchema);