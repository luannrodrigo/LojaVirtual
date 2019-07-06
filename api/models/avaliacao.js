const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AvaliacaoSchema = Schema({
    nome: {
        type: String,
        require: true
    },
    texto: {
        type: String,
        require: true
    },
    pontuacao: {
        type: Number,
        default: 1
    },
    produto: {
        type: Schema.Types.ObjectId,
        ref: 'Produto',
        require: true
    },
    loja: {
        type: Schema.Types.ObjectId,
        ref: 'Loja',
        require: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Avaliacao', AvaliacaoSchema)