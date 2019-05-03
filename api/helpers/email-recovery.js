const transporter = require("nodemailer").createTransport(require("../config/email"));
const {api: link} = require("../config/index");

module.exports = ({usuario, recovery}, cb) => {
    const message = `
      <h1 >Recuperar senha</h1>  
      <br>
      <p>Aqui esta um link para redefinir a sua senha. Acesse ele e digite sua nova senha</p>
      <a href="${link}/v1/api/usuarios/senha-recuperada?token=${recovery.token}">Clique aqui</a>
      
      <br/><br/><hr/>
      
      <p>Obs.: Se você não solicitou a redefinir, apenas ignore esse e-mail</p>
      
      <p>Atencionamente</p>
    `;

    const opEmail = {
        from: "noreply@loja.com.br",
        to: usuario.email,
        subject: "Redefinição de senha - Loja",
        html: message
    };
    if (process.env.NODE_ENV === "production"){
        transporter.senderEmail(opEmail, (error, info) => {
           if (error){
               console.log(error);
               return cb("Aconteceu um erro no envio do e-mail, tente novamente");
           }else{
               return cb(null, "Link para redefinição de senha foi enviado com sucesso para o seu e-mail");
           }
        });
    }else{
        console.log(opEmail);
        return cb(null, "Link para redefinição de senha foi enviado com sucesso para o seu e-mail");
    }
}