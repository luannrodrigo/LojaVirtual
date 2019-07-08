const mongoose = require('mongoose')

const Categoria = mongoose.model('Categoria')

class CategoriaController {
    //Get /index
    index(req, res, next) {
        Categoria.find({
            loja: req.query.loja
        }) //obj  traz todos os dados da loja
            .select('_id produtos nome codigo loja') //obj traz apenas os que estão dentro do select
            .then(categorias => res.send({
                categorias
            }))
            .catch(next)
    }
    //get /disponiveis -> mostra apenas as categorias marcadas como disponiveis
    indexDisponiveis(req, res, next) {
        Categoria
            .find({
                loja: req.query.loja,
                disponibilidade: true
            })
            .select('_id produtos nome codigo loja')
            .then((categorias) => res.send({
                categorias
            }))
            .catch(next)
    }

    // /:id show -> mostra apenas uma categoria
    show(req, res, next) {
        Categoria
            .findOne({
                loja: req.query.loja,
                _id: req.params.id
            })
            .select('_id produtos nome codigo loja')
            .populate(['produtos']) // retornando um array com os produtos
            .then(categoria => res.send({
                categoria
            }))
            .catch(next)
    }

    //post / store
    store(req, res, next) {
        const {
            nome,
            codigo
        } = req.body //pegando nome e codigo pelo body
        const {
            loja
        } = req.query // pegando a loja pela query

        const categoria = new Categoria({
            nome,
            codigo,
            loja,
            disponibilidade: true
        }) //criação do modelo categoria com os dados que retornados tanto do body quanto da query
        categoria.save()
            .then(() => res.send({
                categoria
            }))
            .catch(next)
    }

    //put /:id update
    async update(req, res, next) {
        const {
            nome,
            codigo,
            disponibilidade,
            produtos
        } = req.body
        try {
            const categoria = await Categoria.findById(req.params.id)

            //verificando se alguns dos campos sera atualizados
            if (nome) categoria.nome = nome
            if (codigo) categoria.codigo = codigo
            if (disponibilidade !== undefined) categoria.disponibilidade = disponibilidade
            if (produtos) categoria.produtos = produtos

            await categoria.save()
            return res.send({
                categoria
            })

        } catch (e) {
            next(e)
        }

    }

    //delete /:id remove
    async remove(req, res, next) {
        try {
            const categoria = await Categoria.findById(req.params.id)
            await categoria.remove()
            return res.send({
                deletado: true
            })
        } catch (e) {
            next(e)
        }
    }

    /*
     *
     * PRODUTOS
     *
     *
     * */
    async showProdutos(req, res, next) {
        const {
            offset,
            limit
        } = req.query
        try {
            const produtos = await Produto.paginate(
                { categoria: req.params.id },
                { offset: Number(offset) || 30, limit: Number(limit) || 30 }
            )
            return res.send({ produtos })
        } catch (e) {
            next(e)
        }
    }

    async updateProdutos(req, res, next){
        try {
            const categoria = await Categoria.findById(req.params.id)
            const { produtos } = req.body

            if (produtos) categoria.produtos = produtos
            await categoria.save()

            const _produtos = await Produto.paginate(
                {
                    categoria: req.params.id
                }, 
                {
                    offset: 0, 
                    limit: 30
                }
            )
            return res.send({
                produtos: _produtos
            })
        } catch (e) {
            next(e)
        }
    }
    
    
}


module.exports = CategoriaController