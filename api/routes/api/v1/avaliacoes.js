const router = require('express').Router()
console.log('aa')
const Validation = require('express-validation')

const AvaliacaoController = require('../../../controllers/AvaliacaoController')

const {LojaValidation} = require("../../../controllers/validacoes/lojaValidation")
const {AvaliacaoValidation} = require("../../../controllers/validacoes/avaliacaoValidation")
const auth = require('../../auth')

const avaliacaoController = new AvaliacaoController()

//Cliente/visitante
router.get("/", Validation(AvaliacaoValidation.index), avaliacaoController.index)
router.get("/:id", Validation(AvaliacaoValidation.show), avaliacaoController.show)
router.post("/", auth.required, Validation(AvaliacaoValidation.store), avaliacaoController.store)

//ADMIN
router.delete('/:id', auth.required, LojaValidation.admin, Validation(AvaliacaoValidation.remove), avaliacaoController.remove)

module.exports = router




