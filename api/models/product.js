const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    idSistema: Array,
    nome : String,
    descricao: Array,
    marca: String,
    preco: Array,
    estoque: Array,
    embalagem: Array,
    imagem: { type : String, default: "uploads/default.png" }

});

module.exports = mongoose.model('Product', productSchema);