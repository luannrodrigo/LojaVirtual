const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');
const enviarEmailRecovery = require('../helpers/email-recovery');

class UsuarioController {
    constructor() {
        //get -> para listar os usuario
        index(req, res, next){
            Usuario.findById(req.payload.id).then(usuario => {
                if (!usuario)return res.status(401).json({erros: "Usuario não registrado"});
                return res.json({usuario: usuario.enviarAuthJson()});
            }).catch(next);
        }
        // get:id -> listar usuarios expecificos
        show(req, res, next){
            Usuario.findById(req.params.id).then(usuario => {
                if (!usuario)return res.status(401).json({erros: "Usuario não registrado"});
                return re.json({
                    usuario:{
                        nome: usuario.nome,
                        email: usuario.email,
                        permissao: usuario.permissao,
                        loja: loja
                    }
                });
            }).catch(next);
        }
        //post -> /registrar
        store(req, res, next){
            const {nome, email, password} = req.body;

            const usuario = new Usuario({nome, email});

            usuario.save()
                .then(()=> res.json({usuario: usuario.enviarAuthJson()}));
                .catch(next);
        }
    }
