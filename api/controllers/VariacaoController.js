const mongoose = require('mongoose')

const Variacao = mongoose.model('Variacao')
const Produto = mongoose.model('Produto')

class VariacaoController {
    //Get / - Index
    async index(req, res, next) {
        const {
            loja,
            produto
        } = req.query
        try {
            const variacoes = await Variacao.find({
                loja,
                produto
            })

            return res.send({
                variacoes
            })

        } catch (e) {
            next(e)
        }
    }

    //Get /:id - show
    async show(req, res, next) {
        const {
            loja,
            produto
        } = req.query

        const {
            id: _id
        } = req.params

        try {
            const variacao = await Variacao.find({
                loja,
                produto,
                _id
            })

            return res.send({
                variacao
            })

        } catch (e) {
            next(e)
        }
    }

    //Post / - Store
    async store(req, res, next) {
        const {
            codigo,
            nome,
            preco,
            promocao,
            entrega,
            quantidade
        } = req.body

        const {
            loja,
            produto
        } = req.query

        try {
            const variacao = new Variacao({
                codigo,
                nome,
                preco,
                entrega,
                quantidade,
                loja,
                produto
            })

            const _produto = await Produto.findById(produto)
            if (!_produto) return res.status(400).send({
                error: 'Produto não encontrado'
            })
            _produto.variacoes.push(variacao._id)

            await _produto.save()
            await variacao.save()

            return res.send({
                variacao
            })
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    //Put /:id - update
    async update(req, res, next) {
        const {
            codigo,
            nome,
            preco,
            promocao,
            entrega,
            quantidade,
            disponibilidade
        } = req.body

        const {
            loja,
            produto,
        } = req.params


        try {
            const variacao = await Variacao.findById(req.params.id)
            if(!variacao) return res.status(400).send({error: 'Variação não encontrada'})

            if (codigo) variacao.codigo = codigo
            if (nome) variacao.nome = nome
            if (preco) variacao.preco = preco
            if (promocao) variacao.promocao = promocao
            if (entrega) variacao.entrega = entrega
            if (quantidade) variacao.quantidade = quantidade
            if (disponibilidade !== undefined) variacao.disponibilidade = disponibilidade

            await variacao.save()

            return res.send({
                variacao
            })
        } catch (e) {
            next(e)
        }
    }
    //Put /images/:id - updateimages

    async updateImages(req, res, next) {
        const {
            loja, 
            produto
        } = req.query
        const {
            id: _id
        } = req.params

        try {
            const variacao = await Variacao.findOne({
                loja,
                produto,
                _id
            })
            if (!variacao) return res.status(400).send({ error: 'Variação não encontrada'})

            const novasImagens = req.files.map(item => item.filename)
            console.log(novasImagens)
            variacao.fotos = variacao.fotos.filter(item => item).concat(novasImagens)

            await variacao.save()
            
            return res.send({variacao})
            
        } catch (e) {
            console.log(e)
            next (e)
        }
    }

    //delete /:id - remove

    async remove(req, res, next){
        const {
            loja, 
            produto
        } = req.query
        const {
                id: _id
        } = req.params

        try {
            const variacao = await Variacao.findOne({
                loja,
                produto,
                _id
            })

            if (!variacao) return res.status(400).send({error: 'Variação não encontrada'})

            const _produto = await Produto.findById(variacao.produto)
            _produto.variacoes = _produto.variacoes.filter(item => item.toString() !== variacao._id.toString())

            await _produto.save()

            await variacao.remove()

            return res.send({ detelado: true })
        } catch (e) {
            next (e)
        }
    }
}

module.exports = VariacaoController