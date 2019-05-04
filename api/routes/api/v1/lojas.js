const router = require('express').Router();
const {LojaValidation} = require("../../../controllers/validacoes/lojaValidation");
const auth = require('../../auth');
const LojaController = require('../../../controllers/LojaController');

const Validation = require('express-validation');

//instanciando uma classe UsuarioController
const lojaController = new LojaController();

//definindo as rotas
router.get("/", lojaController.index); // ok
router.get("/:id", Validation(LojaValidation.show), lojaController.show) // ok

router.post("/", auth.required, Validation(LojaValidation.store), lojaController.store); // ok
router.put("/:id", auth.required, LojaValidation.admin, Validation(LojaValidation.update), lojaController.update); //ok
router.delete("/:id", auth.required, LojaValidation.admin, lojaController.remove); //ok

//export router
module.exports = router;