const router = require('express').Router()

const Produtocontroller = require('../../../controllers/ProdutoController')

const { LojaValidation } = require('../../../controllers/LojaController')
const auth = require('../../auth')
const upload = require('../../../config/multer')

const produtoController = new Produtocontroller()

//rotas admins
router.post('/', auth.required, LojaValidation.admin, produtoController.store)
router.put('/:id', auth.required, LojaValidation.admin, produtoController.update)
router.put('/iamges/:id', auth.required, LojaValidation.admin, upload.array('files', 4), produtoController.store)
router.delete('/:id', auth.required, LojaValidation.admin, produtoController.store)


//rotas clientes
router.get('/', produtoController.index)
router.get('/disponiveis', produtoController.indexDisponiveis)
router.get('/search/:search', produtoController.search)
router.get('/:id', produtoController.show)

//variações 

//avaliações 

module.exports = router