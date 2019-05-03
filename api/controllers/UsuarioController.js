const mongoose = require("mongoose");
const Usuario = mongoose.model("Usuario");
const enviarEmailRecovery = require('../helpers/email-recovery');

class UsuarioController {
    //get -> para listar os usuario
    index(req, res, next){
        Usuario.findById(req.payload.id).then(usuario => {
            //validação quando não identifica o id na base
            if (!usuario)return res.status(401).json({errors: "Usuario não registrado"});
            return res.json({usuario: usuario.enviarAuthJson()});
        }).catch(next);
    }
    // get:id -> listar usuarios expecificos
    show(req, res, next){
        Usuario.findById(req.params.id)
            //.populate({path: "loja"})
            .then(usuario => {
            if (!usuario)return res.status(401).json({errors: "Usuario não registrado"});
            return res.json({
                usuario:{
                    nome: usuario.nome,
                    email: usuario.email,
                    permissao: usuario.permissao,
                    loja: usuario.loja
                }
            });
        }).catch(next);
    }
    //post -> /registrar
    store(req, res, next){
        const {nome, email, password, loja} = req.body;
        if (!nome || !email || !password || !loja) return res.status(422).json({errors: "Preencha todos os campos"});

        const usuario = new Usuario({nome, email, loja});
        usuario.setSenha(password);

        usuario.save()
            .then(()=> res.json({usuario: usuario.enviarAuthJson()}))
            .catch((err)=>{
                console.log(err);
                next(err);
            });
    }
    //put -> update
    update(req, res, next){
        const {nome, email, password} = req.body;
        Usuario.findById(req.payload.id).then(usuario => {
            if (!usuario)return res.status(401).json({errors: "Usuario não registrado"});
            //verifica se um elemento vai ser alterado e se foi alterado altera apenas o elemento ou mais
            if (typeof nome !== "undefined") usuario.nome = nome;
            if (typeof email !== "undefined") usuario.email = email;
            if (typeof password !== "undefined") usuario.setSenha(password);

            return usuario.save().then(() => {
                return res.json({usuario: usuario.enviarAuthJson()});
            }).catch(next);
        }).catch(next);
    }
    // Delete /
    remove(req, res, next){
        Usuario.findById(req.payload.id).then(usuario => {
            if (!usuario)return res.status(401).json({errors: "Usuario não registrado"});
            //executa a função quando o usuario é removido
            return usuario.remove().then(() => {
                return res.json({deletado: true})
            }).catch(next);
        }).catch(next);
    }
    // post /login
    login(req, res, next){
        const {email, password} = req.body;
        //validando se o campor email e senha são vazios
        if(!email) return res.status(422).json({errors: {email: "email não pode ficar vazio"}});
        if(!password) return res.status(422).json({errors: {email: "senha não pode ficar vazio"}});
        //validando usuario e senha
        Usuario.findOne({email}).then((usuario) => {
            if (!usuario) return res.status(401).json({errors: "Usuario não registrado"});
            if (!usuario.validarSenha(password)) return res.status(401).json({errors: "Senha invalida"});
            return res.json({usuario: usuario.enviarAuthJson()});
        }).catch(next);
    }
    //    recovery
    //    get /recuperar-senha
    showRecovery(req, res, next){
        return res.render('recovery', {error: null, success: null});
    }
    //    post /recuperar-senha
    createRecovery(req, res, next){
        const {email} = req.body;
        if (!email) return res.render('recovery', {error: 'Preencha com o seu email', success: null});
        Usuario.findOne({email}).then((usuario) => {
            if (!usuario) return res.render('recovery', {error: 'Usuario não existe', success: null});

            const recoveryData = usuario.criarTokenRecuperacaoSenha();

            return usuario.save().then(() => {

                enviarEmailRecovery({usuario, recovery: recoveryData},(error = null, success = null) => {
                    return res.render("recovery", {error, success});
                });
            }).catch(next);
        }).catch(next);
    }
    //    get /senha-recuperada
    /*verificar se o token exist
    * verificar se pertence a algum  usuario
    * verificar se ele ainda e valido
     */
    showCompleteRecovery(req, res, next){
        //caso não tenha o token retornar a pagina inicial com o erro

        if (!req.query.token) return res.render("recovery", {error: 'Token não identificado', success: null});
        //caso tenha o token a função encontra o usuario
        Usuario.findOne({'recovery.token': req.query.token}).then(usuario => {
            //verifica se o usuario existe com o token
            if (!usuario) return res.render("recovery", {error: "não existe usuario com este token", success: null});
            //verificando a data de recuperação, caso senha menor retorna o erro
            if (new Date(usuario.recovery.date) < new Date()) return res.render('recovery', {error: 'Token expiriado. Tente novamente', success: null});
            //    token validado com usuario e date retorna a view
            return res.render('recovery/store', {error: null, success: null, token: req.query.token});
        }).catch(next);

    }
    //    post /senha-recuperada
    completeRecovery(req, res, next){
        const {token, password} = req.body;
        //não existir token ou password -> retornar a view store para ser preechida novamente
        if (!token || !password) return res.render('recovery/store', {error: 'Preencha novamente com  a nova senha', success: null, token: token});
        //caso existir token e password, aqui encontramos o usuario
        Usuario.findOne({"recovery.token": token}).then((usuario)=> {
            if (!usuario) return res.render('recovery', {error: 'usuario não identificado', success: null});
            /*
            * se for valido token
            * criou uma senha valida
            * foi encontrado no sistema
            * finalizar a opção de token de recuperação  e setar a nova senha
            * */
            usuario.finzalizarTokenrecuperacaoSenha();
            usuario.setSenha(password);
            return usuario.save().then(() => {
                return res.render('recovery/store',{
                    error: null,
                    success: "Senha alterada com successo. Realize um novo login",
                    token: null
                });
            }).catch(next);
        });
    }
}
module.exports = UsuarioController;

