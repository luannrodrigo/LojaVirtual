const router = require('express').Router();
const auth = require('../../auth');
const UsuarioController = require('../../../controllers/UsuarioController');


/*validação*/
const Validation = require("express-validation");
const {UsuarioValidation} = require("../../../controllers/validacoes/usuarioValidation");


//instanciando uma classe UsuarioController
const usuarioController = new UsuarioController();

//definindo as rotas
//enviando dados de login
router.post('/login', Validation(UsuarioValidation.login), usuarioController.login);
//registrando na plataforma
router.post('/registrar', Validation(UsuarioValidation.store), usuarioController.store); // ok
//atualizando dados
router.put('/', auth.required, Validation(UsuarioValidation.update), usuarioController.update);// ok
/*deletando*/
router.delete('/', auth.required, usuarioController.remove);//ok

//enviar um e-mails de recupe de senha
router.get('/recuperar-senha',usuarioController.showRecovery);
router.post('/recuperar-senha', usuarioController.createRecovery);
router.get('/senha-recuperada',usuarioController.showCompleteRecovery);
router.post('/senha-recuperada', usuarioController.completeRecovery);

//para listar todos os usuairos(administrador)
router.get('/', auth.required, usuarioController.index); // ok
//passando id como paramentro
router.get('/:id', auth.required, Validation(UsuarioValidation.show), usuarioController.show); //ok

//export router
module.exports = router;
