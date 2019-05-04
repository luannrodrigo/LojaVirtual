const router = require('express').Router();
const lojaValidation = require("../../../controllers/validacoes/lojaValidation");
const auth = require('../../auth');
const LojaController = require('../../../controllers/LojaController');

//instanciando uma classe UsuarioController
const lojaController = new LojaController();

//definindo as rotas
router.get("/", lojaController.index); // ok
router.get("/:id", lojaController.show) // ok

router.post("/", auth.required, lojaController.store); // ok
router.put("/:id", auth.required, lojaValidation, lojaController.update); //ok
router.delete("/:id", auth.required, lojaValidation, lojaController.remove); //ok

//export router
module.exports = router;