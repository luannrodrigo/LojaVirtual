const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CategoriaSchema = Schema({
    nome: {type: String, require: true},
    codigo: {type: String, require: true},
    disponibilidade: {type: Boolean, default: true},
    produtos: {type: [{type: Schema.Types.ObjectId, ref: 'Produto'}]},
    loja: {type: Schema.Types.ObjectId, ref: 'Loja'}
}, {timestamps: true})

module.exports = mongoose.model('Categoria', CategoriaSchema)