const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const LojaSchema = mongoose.Schema({
    nome: {type: String, required: true},
    cnpj: {type: String, required: true},
    email: {type: String, required: true},
    telefones: {
        type: [{type: String}]
    },
    endereco:{
        type:{
            local:{type: String, required: true},
            numero: {type: String, required: true},
            compelemento: {type: String},
            bairro: {type: String, required: true},
            cidade: {type: String, required: true}
        },
        required: true
    }
}, {timestamp: true});
LojaSchema.plugin(uniqueValidator, {message: "já esta sendo usado"})

module.exports = mongoose.model("Loja", LojaSchema)