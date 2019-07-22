const mongoose = require('mongoose');

const Pedido = mongoose.model('Pedido');
const Produto = mongoose.model('Produto');
const Variacao = mongoose.model('Variacao');

const Cliente = mongoose.model('Cliente');
const Usuario = mongoose.model('Usuario');

class ClienteController {

    /*
     *
     * ADMIN
     * */
    //GET / index
    async index(req, res, next) {
        try {
            const offset = Number(req.query.offset) || 0;
            const limit = Number(req.query.limit) || 30;

            const clientes = await Cliente.paginate({
                loja: req.query.loja
            }, {
                offset,
                limit,
                populate: {
                    path: 'usuario',
                    select: '-salt -hash'
                }
            });
            return res.send({
                clientes
            });
        } catch (e) {
            next(e);
        }
    }
    // get /search/:search/pedidos

    async searchPedidos(req, res, next) {
        const {
            offset,
            limite,
            loja
        } = req.query

        try {
            const search = new RegExp(req.params.search, 'i')
            const clientes = await Cliente.find({
                loja,
                nome: {
                    $regex: search
                }
            })
            const pedidos = await Pedido.paginate({
                loja,
                cliente: {
                    $in: clientes.map(item => item._id)
                }
            }, {
                offset,
                limit,
                populate: ['cliente', 'pagamento', 'Entrega']
            })

            pedidos.docs = await Promise.all(pedidos.docs.map(async (pedido) => {
                pedido.carrinho = await Promise.all(pedido.carrinho.map(async (item) => {
                    item.produto = await Produto.findById(item.produto)
                    item.variacao = await Variacao.findById(item.variacao)
                }))
                return pedido
            }))

        } catch (e) {
            next(e)
        }
    }

    // get /search/:search
    async search(req, res, next) {
        const offset = Number(req.query.offset) || 0;
        const limit = Number(req.query.limit) || 30;
        const search = new RegExp(req.params.search, 'i');
        try {
            const clientes = await Cliente.paginate({
                loja: req.query.loja,
                nome: {
                    $regex: search
                }
            }, {
                offset,
                limit,
                populate: {
                    path: 'usuario',
                    select: '-salt -hash'
                }
            });
            return res.send({
                clientes
            });
        } catch (e) {
            next(e);
        }
    }
    //get /admin/:id
    async showAdmin(req, res, next) {
        try {
            const cliente = await Cliente.findOne({
                _id: req.params.id,
                loja: req.query.loja
            }).populate({
                path: 'usuario',
                select: '-salt -hash'
            });
            return res.send({
                cliente
            });
        } catch (e) {
            next(e);
        }
    }
    ///admin/:id/pedidos
    async showPedidosClientes(req, res, next) {
        const {
            offset,
            limite,
            loja
        } = req.query;

        try {
            const pedidos = await Pedido.paginate({
                loja,
                cliente: req.params.id
            }, {
                offset: Number(offset || 0),
                limit: Number(limit || 30),
                populate: ['cliente', 'pagamento', 'entrega']
            })
            /**
             *Polulate 
             * promise.all para percorrer todos os pedido e colcoar todos os produtos e variação individualmente 
             */

            pedidos.docs = await Promise.all(pedido.docs.map(async (pedido) => {
                pedido.carrinho = await Promise.all(pedido.carrinho.map(async (item) => {
                    item.produto = await Produto.findById(item.produto)
                    item.variacao = await Variacao.findById(item.variacao)
                    return item
                }))
                return pedido
            }))
            return pedido
        } catch (e) {
            next(e)
        }
    }

    //Put  /admin/:id
    async updateAdmin(req, res, next) {
        const {
            nome,
            cpf,
            email,
            telefones,
            endereco,
            dataNascimento
        } = req.body;
        try {
            const cliente = await Cliente.findById(req.params.id).populate('usuario');
            if (nome) {
                cliente.usuario.nome = nome;
                cliente.nome = nome;
            }
            if (email) cliente.usuario.email = email;
            if (cpf) cliente.usuario.cpf = cpf;
            if (telefones) cliente.telefones = telefones;
            if (endereco) cliente.endereco = endereco;
            if (dataNascimento) cliente.dataNascimento = dataNascimento;

            await cliente.save();

            cliente.usuario = {
                email: cliente.usuario.email,
                _id: cliente.usuario._id,
                permissao: cliente.usuario.permissao
            }
            return res.send({
                cliente
            })
        } catch (e) {
            next(e);
        }
    }

    /*
     *
     * CLIENTE
     * */

    async show(req, res, next) {
        try {
            const cliente = await Cliente.findOne({
                usuario: req.payload.id,
                loja: req.query.loja
            }).populate({
                path: 'usuario',
                select: '-hash -salt'
            });
            return res.send({
                cliente
            });
        } catch (e) {
            next(e);
        }
    }
    async store(req, res, next) {
        const {
            nome,
            email,
            cpf,
            telefones,
            endereco,
            dataNascimento,
            password
        } = req.body;
        const {
            loja
        } = req.query;

        const usuario = new Usuario({
            nome,
            email,
            loja
        });
        usuario.setSenha(password);

        const cliente = new Cliente({
            nome,
            cpf,
            telefones,
            endereco,
            loja,
            dataNascimento,
            usuario: usuario._id
        });

        try {
            await usuario.save();
            await cliente.save();

            return res.send({
                cliente: Object.assign({}, cliente._doc, {
                    email: usuario.email
                })
            });
        } catch (e) {
            next(e);
        }
    }
    async update(req, res, next) {
        const {
            nome,
            email,
            cpf,
            telefones,
            endereco,
            dataNascimento,
            password
        } = req.body;
        try {
            const cliente = await Cliente.findOne({
                usuario: req.payload.id
            }).populate({
                path: 'usuario',
                select: '-salt -hash'
            });
            if (!cliente) return res.send({
                errors: "Usuario não existe"
            })
            if (nome) {
                cliente.usuario.nome = nome;
                cliente.nome = nome;
            }
            if (email) cliente.usuario.email = email;
            if (password) cliente.usuario.setSenha(password);
            if (cpf) cliente.cpf = cpf;
            if (telefones) cliente.telefones = telefones;
            if (endereco) cliente.endereco = endereco;
            if (dataNascimento) cliente.dataNascimento = dataNascimento;

            await cliente.save();

            cliente.usuario = {
                email: cliente.usuario.email,
                _id: cliente.usuario._id,
                permissao: cliente.usuario.permissao
            }
            return res.send({
                cliente
            });

        } catch (e) {
            next(e);
        }
    }

    async remove(req, res, next) {
        console.log(req)
        try {
            const cliente = await Cliente.findOne({
                usuario: req.payload.id
            }).populate('usuario');
            await cliente.usuario.remove();
            cliente.deletado = true;
            await cliente.save();
            return res.send({
                deletado: true
            });
        } catch (e) {
            next(e);
        }
    }
}

module.exports = ClienteController;