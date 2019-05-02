module.exports = {
    secret: process.env.NODE_ENV === "production" ? process.env.SECRET : "SCLMSDOKCMJOIWOIRJ03QREOQ3I4OI4JROQIMFEOIMFOALWKDFOKIAJOIFJOIDJFMLOSDJFOISJFGOIJEGOITJOINOIGJIADLKFOEWER2P3OKEPO230EP32OKERFORGNFOREGFNEROIGJTOGITG",
    api: process.env.NODE_ENV === "production" ? "https://lu.dev" : "http://localhost:3000",
    loja: process.env.NODE_ENV === "production"? "https://lu.dev": "http://localhost:8000"
};
