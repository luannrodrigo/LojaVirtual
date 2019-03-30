const router = require('express').Router();
const auth = require('../../auth');
const UsuarioController = require('../../../controller/UsuarioController');

//instanciando uma classe UsuarioController
const usuarioController = new UsuarioController();

//definindo as rotas
//para listar todos os usuairos(administrador)
router.get('/', auth.required, usuarioController.index);
//passando id como paramentro
router.get('/:id', auth.required, usuarioController.show);

//enviando dados de login
router.post('/login', usuarioController.login)
//registrando na plataforma
router.post('/registrar', usuarioController.store);
//atualizando dados
router.put('/', auth.required, usuarioController.update);
//deletando
router.get('/', auth.required, usuarioController.remove)

//enviar um e-mails de recupe de senha
router.get('/recuperar-senha',usuarioController.showRecovery);
router.post('/recuperar-senha', usuarioController.createRecovery);
router.get('senha-recuperada',usuarioController.show.CompleteRecovery);
router.post('senha-recuperada', usuarioController.CompleteRecovery);

//export router
module.exports = router;
