const router = require('express').Router();

const ClienteController = require('../../../controllers/ClienteController');
const {LojaValidation} = require('../../../controllers/validacoes/lojaValidation');
const {ClienteValidation} = require('../../../controllers/validacoes/clienteValidation');
const auth = require('../../auth');
const Validation = require('express-validation');

const clienteController = new ClienteController();

//Admin
router.get('/', auth.required, LojaValidation.admin, Validation(ClienteValidation.index), clienteController.index);
// router.get('/search/:search/pedidos', auth.required, LojaValidation.admin, clienteController.searchPedidos);//para pesquisar dos pedidos
router.get('/search/:search', auth.required, LojaValidation.admin, Validation(ClienteValidation.search),clienteController.search);
//router.get('/admin/:id', auth.required, LojaValidation.admin, Validation(ClienteValidation.showAdmin),clienteController.showAdmin);
router.get('/admin/:id/:pedidos', auth.required, LojaValidation.admin, clienteController.showPedidos);

router.put('/admin/:id', auth.required, LojaValidation.admin, Validation(ClienteValidation.updateAdmin), clienteController.updateAdmin);

//cliente
router.get('/:id', auth.required, alidation(ClienteValidation.show), clienteController.show);
router.post('/', alidation(ClienteValidation.store), clienteController.store);
router.put('/:id', alidation(ClienteValidation.update), auth.required, clienteController.update);
router.delete('/:id', alidation(ClienteValidation.remove), auth.required, clienteController.remove);

module.exports = router;