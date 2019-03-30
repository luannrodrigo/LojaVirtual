const jwt = require("express-jwt");
const secret = require("../config").secret;


//function que verifica se o usuario tem um token valido e coleta o token
function getTokenFromHeader(req) {
    if (!req.headers.authorization) return null
    // verifica se o token é valido pelo código "Ecommerce", se não ele seta como null e exclui o user
    const token = req.headers.authorization.split("");
    if(token[0] !== "Ecommerce") return null;
    return token[1];
}

const auth = {
    required: jwt({
        secret,
        userProperty: 'payload',
        getToken: getTokenFromHeader
    }),
    optional: jwt({
        secret,
        userProperty: 'payload',
        credentialsRequired: false,
        getToken: getTokenFromHeader
    })
}

module.exports = auth;
