const mongoose = require('mongoose');
    Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = require('../config').secret;

const UsuarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, "não pode ser vazio."]
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "não pod ser vazio."],
        index: true,
        match: [/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, "email invalido"]//verifica se o email e valido
    },
    loja: {
        type: Schema.Types.ObjectId,
        ref: "Loja",
        required: [true, "não pode ser vazio."]
    },
    // verifica a permissão do usuario se é admin ou cliente
    permissao: {
        type: Array,
        default: ["cliente"]
    },
    // Com hash e salt não é preciso guardar a senha do server
    hash: String,
    salt: String,
    recovery: {
        type: {
            token: String,
            date: Date
        },
        default: {}
    }
}, {timeStamps: true}) //Manter dois dados por padrão no mongoose: data em que foi criando e se foi alterado.

// ativando o plugin do uniqueValidator para os campos
UsuarioSchema.plugin(uniqueValidator, {message: "email existe em nossa base de dados"});

// Para criar uma nova senha
UsuarioSchema.methods.setSenha  = function(password) {
    this.salt = crypto.randomBytes(16).toString("hex");
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, "sha512").toString('hex')
}

// metodo que valida a senha
UsuarioSchema.methods.validarSenha = function(password) {
    const hash = crypto.pbkdf2Sync(password, this. salt, 10000, 512, "sha512").toString('hex');
    return hash === this.hash;
};
UsuarioSchema.methods.gerarToken = function(){
    const hoje = new Date();
    const exp = new Date(hoje);
    exp.setDate(hoje.getDate() + 15);

    return jwt.sign({
        id: this._id,
        email: this.email,
        nome: this.nome,
        exp: parseFloat(exp.getTime() / 1000, 10)
    }, secret)
};

UsuarioSchema.methods.enviarAuthJson = function() {
    return {
        nome: this.nome,
        email: this.email,
        loja: this.loja,
        role: this.permissao,
        token: this.gerarToken()
    };
};

// recuperação de senha
UsuarioSchema.methods.criarTokenRecuperacaoSenha = function() {
    this.recovery = {};
    this.recovery.token = crypto.randomBytes(16).toString('hex');
    this.recovery.date = new Date(new Date().gatTime() + 24*60*60*1000);
    return this.recovery;
}

UsuarioSchema.methods.finzalizarTokenrecuperacaoSenha = function(){
    this.recovery = {token: null, date: null};
    return this.recovery;
};
module.exports = mongoose.model("Usuario", UsuarioSchema);
