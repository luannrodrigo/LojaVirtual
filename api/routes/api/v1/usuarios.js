const router = require('express').Router();
const auth = require('../../auth');
const UsuarioController = require('../../../controllers/UsuarioController');

//instanciando uma classe UsuarioController
const usuarioController = new UsuarioController();

//definindo as rotas


//enviando dados de login
router.post('/login', usuarioController.login);
//registrando na plataforma
router.post('/registrar', usuarioController.store); // ok
//atualizando dados
router.put('/', auth.required, usuarioController.update);// ok
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
router.get('/:id', auth.required, usuarioController.show); //ok

//export router
module.exports = router;
