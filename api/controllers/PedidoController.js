const mongoose = require('mongoose')

const Pedido = mongoose.model('Pedido')
const Produto = mongoose.model('Produto')
const Variacao = mongoose.model('Variacao')
const Pagamento = mongoose.model('Pagamento')
const Entrega = mongoose.model('Entrega')
const Cliente = mongoose.model('Cliente')

const CarrinhoValidation = require('./validacoes/carrinhoValidation')

class PedidoController {
    //ADMIN
    // get /admin - indexAdmin
    async indexAdmin(req, res, next) {
        const {
            offset,
            limit,
            loja
        } = req.query;
        
        try {
            const pedidos = await Pedido.paginate({
                loja
            }, {
                offset: Number(offset || 0),
                limit: Number(limit || 30),
                populate: ['cliente', 'pagamento', 'entrega']
            })
            /**
             *Polulate 
             * promise.all para percorrer todos os pedido e colcoar todos os produtos e variação individualmente 
             */
            
            pedidos.docs = await Promise.all(pedidos.docs.map(async (pedido) => {
                pedido.carrinho = await Promise.all(pedido.carrinho.map(async (item) => {
                    item.produto = await Produto.findOne(item.produto)
                    item.variacao = await Variacao.findOne(item.variacao)
                    return item
                }))
                return pedido
            }))
            return res.send({
                pedidos
            })
        } catch (e) {
            console.log(e)
            next(e)
        }
    }
    // get /admin/:id - showAdmin
    async showAdmin(req, res, next) {
        try {
            const pedido = await Pedido
                .findOne({
                    loja: req.query.loja,
                    _id: req.params.id
                })
                .populate(['cliente', 'pagamento', 'entrega'])
            pedido.carrinho = await Promise.all(pedido.carrinho.map(async (item) => {
                item.produto = await Produto.findById(item.produto)
                item.variacao = await Variacao.findById(item.variacao)
                return item
            }))
            return res.send({
                pedido
            })
        } catch (e) {
            next(e)
        }
    }


    // delete /admin/:id  removeAdmin
    async removeAdmin(req, res, next) {
        try {
            const pedido = await Pedido.findOne({
                loja: req.query.loja,
                _id: req.params.id
            })
            if (!pedido) return res.status(400).send({
                error: 'Pedido não encontrado'
            })
            pedido.cancelado = true

            //registro de atividade = pedido cancelado
            //enviar Email para cliente e admin = pedido cancelado

            await pedido.save()

            return res.send({
                cancelado: true
            })
        } catch (e) {
            next(e)
        }
    }

    // -- cliente
    // Get /admin/:id/carrinho showCarrinhoPedidoAdmin
    async showCarrinhoPedidoAdmin(req, res, next) {
        try {
            const pedido = await Pedido
                .findOne({
                    loja: req.query.loja,
                    _id: req.params.id
                })
            pedido.carrinho = await Promise.all(pedido.carrinho.map(async (item) => {
                item.produto = await Produto.findById(item.produto)
                item.variacao = await Variacao.findById(item.variacao)
                return item
            }))
            return res.send({
                pedido
            })
        } catch (e) {
            next(e)
        }
    }

    // Get '/' - Index
    async index(req, res, next) {
        const {
            offset,
            limit,
            loja
        } = req.query;

        try {
            const cliente = await Cliente.findOne({
                usuario: req.payload.id
            })
            const pedidos = await Pedido.paginate({
                loja,
                _id: req.params.id
            }, {
                offset: Number(offset || 0),
                limit: Number(limit || 30),
                populate: ['cliente', 'pagamento', 'entrega']
            })
            /**
             *Polulate 
             * promise.all para percorrer todos os pedido e colcoar todos os produtos e variação individualmente 
             */

            pedidos.docs = await Promise.all(pedidos.docs.map(async (pedido) => {
                pedido.carrinho = await Promise.all(pedido.carrinho.map(async (item) => {
                    item.produto = await Produto.findById(item.produto)
                    item.variacao = await Variacao.findById(item.variacao)
                    return item
                }))
                return pedido
            }))
           return res.send({
               pedidos
           })
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    // Get/:id - show

    async show(req, res, next) {
        try {
            const cliente = await Cliente.findOne({
                usuario: req.payload.id
            })
            const pedido = await Pedido
                .findOne({
                    cliente: cliente._id,
                    _id: req.params.id
                })
                .populate(['cliente', 'pagamento', 'entrega'])
            pedido.carrinho = await Promise.all(pedido.carrinho.map(async (item) => {
                item.produto = await Produto.findById(item.produto)
                item.variacao = await Variacao.findById(item.variacao)
                return item
            }))
            return res.send({
                pedido
            })
        } catch (e) {
            next(e)
        }
    }

    //post / - Store
    async store(req, res, next) {
        const {
            carrinho,
            pagamento,
            entrega
        } = req.body

        const {
            loja
        } = req.query


        try {
            //checar dados do carrinho
            if (await CarrinhoValidation(carrinho)) return res.status(422).send({
                error: 'Carrinho invalido'
            })
            //checar dados do entrega
            if (!EntregaValidation(carrinho, entrega)) return res.status(422).send({
                error: 'Dados de entrega invalidos'
            })
            //checar dados do pagamento
            if (!PagamentoValidation(carrinho, pagamento)) return res.status(422).send({
                error: 'Dados de entrega invalidos'
            })

            const cliente = await Cliente.findOne({
                usuario: req.payload.id
            })

            const novoPagamento = new Pagamento({
                valor: pagamento.valor,
                forma: pagamento.forma,
                status: 'Iniciando',
                payload: pagamento,
                loja
            })

            const novaEntrega = new Entrega({
                status: 'nao_iniciado',
                custo: entrega.custo,
                prazo: entrega.prazo,
                tipo: entrega.tipo,
                payload: entrega,
                loja
            })

            const pedido = new Pedido({
                cliente: cliente._id,
                carrinho,
                pagamento: novoPagamento._id,
                entrega: novaEntrega._id,
                loja
            })

            novoPagamento.pedido = pedido._id
            novaEntrega.pedido = pedido._id

            await pedido.save()
            await novoPagamento.save()
            await novaEntrega.save()

            //Notificar via E-mail - cliente admin = novo pedido
            return res.send({
                pedido: Object.assign({}, pedido._doc, {
                    entrega: novaEntrega,
                    pagamento: novoPagamento
                })
            })
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    // delete /:id - remove
    async remove(req, res, next) {
        try {
            const cliente = await Cliente.findById({
                usuario: req.payload.id
            })
            if (!cliente) return res.status(400).send({
                error: 'Cliente não encontrado'
            })
            const pedido = await Pedido.findOne({
                cliente: cliente._id,
                _id: req.params.id
            })
            if (!pedido) return res.status(400).send({
                error: 'Pedido não encontrado'
            })
            pedido.cancelado = true

            //registro de atividade = pedido cancelado
            //enviar Email para cliente e admin = pedido cancelado

            await pedido.save()

            return res.send({
                cancelado: true
            })
        } catch (e) {
            next(e)
        }
    }

    // -- cliente
    // get '/:id/carrinho  - showCarrinhoPedido
    async showCarrinhoPedido(req, res, next) {
        try {
            const pedido = await Pedido
                .findOne({
                    cliente: cliente._id,
                    _id: req.params.id
                })
            pedido.carrinho = await Promise.all(pedido.carrinho.map(async (item) => {
                item.produto = await Produto.findById(item.produto)
                item.variacao = await Variacao.findById(item.variacao)
                return item
            }))
            return res.send({
                pedido
            })
        } catch (e) {
            next(e)
        }
    }

}

module.exports = PedidoController