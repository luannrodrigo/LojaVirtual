const mongoose = require('mongoose');

const Usuario = mongoose.model("Usuario");
const Loja = mongoose.model("Loja");

monsule.exports = (req, res, next) => {
    if (!req.payload.id) return res.sendStatus(401);
    const {loja} = req.query;
    if (!loja) return res.sendStatus(401);
    Usuario.findById(req.payload.id).then(usuario => {
        if (!usuario && !usuario.loja && !usuario.permissao.includes("admin") && !usuario.loja !== loja ) return res.sendStatus(401);
        next();
    }).catch(next);
};