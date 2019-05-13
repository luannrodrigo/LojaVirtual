const router = require("express").Router();

router.use('/lojas', require('./lojas'));
router.use('/usuarios', require('./usuarios'));
router.use('/clientes', require('./clientes'));

module.exports = router;
