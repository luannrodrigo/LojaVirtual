const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const LojaSchema = mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    cnpj: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    telefones: {
        type: [{
            type: String
        }]
    },
    endereco: {
        type: {
            local: {
                type: String,
                required: true
            },
            numero: {
                type: String,
                required: true
            },
            complemento: {
                type: String
            },
            bairro: {
                type: String,
                required: true
            },
            cidade: {
                type: String,
                required: true
            },
            CEP: {
                type: String,
                required: true
            }
        },
        required: true
    }
}, {
    timestamps: true
});
LojaSchema.plugin(uniqueValidator, {
    message: "já esta sendo usado"
})

module.exports = mongoose.model("Loja", LojaSchema)