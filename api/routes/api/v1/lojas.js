const router = require('express').Router();
const lojaValidation = require("../../../controllers/validacoes/lojaValidation");
const auth = require('../../auth');
const LojaController = require('../../../controllers/UsuarioController');

//instanciando uma classe UsuarioController
const lojaController = new LojaController();

//definindo as rotas
router.get("/", lojaController.index);
router.get("/:id", lojaController.show);

router.post("/", auth.required, lojaController.store);
router.put("/:id", auth.required, lojaValidation, lojaController.update);
router.delete("/:id", auth.required, lojaValidation, lojaController.remove);

//export router
module.exports = router;
