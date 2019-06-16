const router = require('express').Router()

const CategoriaController = require('../../../controllers/CategoriaController')
const { LojaValidation } = require('../../../controllers/validacoes/lojaValidation')
const { CategoriaValidation } = require('../../../controllers/validacoes/categoriaValidation')

const auth = require('../../auth')
const Validation = require('express-validation')

const categoriaController = new CategoriaController()

router.get('/', Validation(CategoriaValidation.index), categoriaController.index)//todos os produtos da categoria
router.get('/disponiveis', Validation(CategoriaValidation.indexDisponiveis), categoriaController.indexDisponiveis) //todos os produtos diponiveis da categoria
router.get('/:id', Validation(CategoriaValidation.show), categoriaController.show) //o produto por categoria

//rotas administrador
router.post('/', auth.required, LojaValidation.admin, Validation(CategoriaValidation.store), categoriaController.store)
router.put('/:id', auth.required, LojaValidation.admin, Validation(CategoriaValidation.update), categoriaController.update)
router.delete('/:id', auth.required, LojaValidation.admin, Validation(CategoriaValidation.remove), categoriaController.remove)

//Rotas Produtos
router.get('/:id/produtos', categoriaController.showProdutos)
router.put('/:id/produtos', auth.required, LojaValidation.admin, categoriaController.updateProdutos)

module.exports = router;