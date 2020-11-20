const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    idSistema: Array,
    nome : {type: String, required: true},
    descricao: {type:[String], validate: { validator : v => Array.isArray(v) && v.length > 0, message: "Informe pelo menos uma descrição"}},
    marca: String,
    preco: Array,
    estoque: Array,
    embalagem: Array,
    imagem: { type : String, default: "uploads/default.png" }

});

module.exports = mongoose.model('Product', productSchema);