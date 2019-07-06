const mongoose = require('mongoose')

const Avaliacao = mongoose.model('Avaliacao')
const Produto = mongoose.model('Produto')

class AvaliacaoController {
    //GET /
    async index(req, res, next) {
        const {
            loja,
            produto
        } = req.query

        try {
            const avaliacoes = await Avaliacao.find({
                loja,
                produto
            })

            return res.send({
                avaliacoes
            })
        } catch (e) {
            next(e)
        }
    }

    //GET /:id
    async show(req, res, next) {
        const {
            loja,
            produto
        } = req.query

        const {
            id: _id
        } = req.params

        try {
            const avaliacoes = await Avaliacao.findOne({
                _id,
                loja,
                produto
            })

            return res.send({
                avaliacao
            })
        } catch (e) {
            next(e)
        }
    }

    //POST / - store
    async store(req, res, next) {
        const {
            nome,
            texto,
            pontuacao
        } = req.body
        const {
            loja,
            produto
        } = req.query
        try {
            const avaliacoes = new({
                nome,
                texto,
                pontuacao,
                loja,
                produto
            })

            const _produto = Produto.findById(produto)
            //add o id do produto nas avaliações
            _produto.avaliacoes.push(avaliacoes._id)

            await _produto.save()
            await avaliacao.save()

            return res.send({
                avaliacao
            })
        } catch (e){
            next(e);
        }
    }

    //DELETE /:id - remove
    async remove(req, res, next) {
        try {
            const avaliacao = await Avaliacao.findById(req.params.id)

            const produto = await Produto.findById(avaliacao.produto)
            //fintrando o array de avaliações dentro de produtos e mantendo apenas que não de mesmo valor que o id do avaliacoes
            produto.avaliacoes = produto.avaliacao.filter(item => item.toString() !== avaliacao._id.toString())

            await produto.save()

            await avaliacao.remove()
            return res.send({
                deletado: true
            })
        } catch (e) {
            next (e)
        }
    }
}

module.exports = AvaliacaoController