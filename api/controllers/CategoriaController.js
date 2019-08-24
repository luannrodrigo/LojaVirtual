const mongoose = require('mongoose')

const Categoria = mongoose.model('Categoria')

class CategoriaController {

    //Get /index
    /**
    * @api {get} /categoria/:id Requisição das categorias de uma loja
    * @apiName GetCategoria
    * @apiGroup Categoria
    *
    * @apiParam {String} id loja.
    *
    * @apiSuccessExample Success-Response: 
    *  HTTP / 1.1 200 OK
    *   {
    *       "categorias": [{
    *           "produtos": [
    *               "5d2b4c234e71550096375e7e",
    *               "5d2b4c504e71550096375e7f",
    *               "5d31bcf86f75fb002ef77db1"
    *           ],
    *           "_id": "5d2b489570905f003473fc11",
    *           "nome": "Infomatica",
    *           "codigo": "123",
    *           "loja": "5d228f1ba90ab80027aff76d"
    *       }]
    *   }
    *
    * @apiError BadRequest parametros da url passados incorretamente, falta do id da loja
    *
    * @apiErrorExample Error-Response:
    *     HTTP/1.1 404 Not Found
    *{
    *    "status": 400,
    *    "statusText": "Bad Request",
    *    "errors": [{
    *        "field": [
    *            "loja"
    *        ],
    *        "location": "query",
    *        "messages": [
    *            "\"loja\" is not allowed to be empty",
    *            "\"loja\" must only contain alpha-numeric characters",
    *            "\"loja\" length must be 24 characters long"
    *        ],
    *        "types": [
    *            "any.empty",
    *            "string.alphanum",
    *            "string.length"
    *        ]
    *    }]
    *}
     */
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
    /**
     * @api {get} /disponiveis/?loja=:id Requisição das categorias de uma loja
     * @apiName GetCategoria
     * @apiGroup Categoria
     *
     * @apiParam {String} id loja.
     *
     * @apiSuccessExample Success-Response: 
     *  HTTP / 1.1 200 OK
     *   {
     *       "categorias": [{
     *           "produtos": [
     *               "5d2b4c234e71550096375e7e",
     *               "5d2b4c504e71550096375e7f",
     *               "5d31bcf86f75fb002ef77db1"
     *           ],
     *           "_id": "5d2b489570905f003473fc11",
     *           "nome": "Infomatica",
     *           "codigo": "123",
     *           "loja": "5d228f1ba90ab80027aff76d"
     *       }]
     *   }
     *
     * @apiError BadRequest parametros da url passados incorretamente, falta do id da loja
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *{
     *    "status": 400,
     *    "statusText": "Bad Request",
     *    "errors": [{
     *        "field": [
     *            "loja"
     *        ],
     *        "location": "query",
     *        "messages": [
     *            "\"loja\" is not allowed to be empty",
     *            "\"loja\" must only contain alpha-numeric characters",
     *            "\"loja\" length must be 24 characters long"
     *        ],
     *        "types": [
     *            "any.empty",
     *            "string.alphanum",
     *            "string.length"
     *        ]
     *    }]
     *}
     */



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
    /**
     * Modulo responsavel por salvar as categorias
     */
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
    /**
     * modulo responsavel por salvar
     */
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

    async updateProdutos(req, res, next) {
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