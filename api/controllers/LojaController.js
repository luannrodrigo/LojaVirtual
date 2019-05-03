const moongose = require("mongoose");
const Loja = mongoose.model("loja");

class LojaController {
    //get /
    index(req, res, next){
        Loja.find({ }).select("_id nome cnpj email telefones endereco");
        .then(lojas => res.send({lojas}));
        .catch(next);
    }

}