const mongoose = require('mongoose')

const Avaliacao = mongoose.model('Avaliacao')
const Produto = mongoose.model('Produto')

class AvaliacaoController {
    //GET /

    /**
     * Modulo responsavel por listar todas as avaliações de  uma loja
     *  
     */
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

    /*
    *Modulo responsavel por listar as avaliações de um produto especifico
    */
    async show(req, res, next) {
        const {
            loja,
            produto
        } = req.query

        const {
            id: _id
        } = req.params

        try {
            const avaliacao = await Avaliacao.findOne({
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
    /**
     * Modulo responsavel por salvar  as avaliações 
     * 
     */
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
            const avaliacao = new Avaliacao({
                nome,
                texto,
                pontuacao,
                loja,
                produto
            })

            const _produto = await Produto.findById(produto)
            if(!_produto) return res.status(422).send({error: 'Produto não existe'})
            //add o id do produto nas avaliações
            _produto.avaliacoes.push(avaliacao._id)

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
    /**
     * Modulo responsavel por remover uma avaliacao especifica 
     */
    async remove(req, res, next) {
        try {
            const avaliacao = await Avaliacao.findById(req.params.id)

            const produto = await Produto.findById(avaliacao.produto)
            //fintrando o array de avaliações dentro de produtos e mantendo apenas que não de mesmo valor que o id do avaliacoes
            produto.avaliacoes = produto.avaliacoes.filter(item => item.toString() !== avaliacao._id.toString())

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