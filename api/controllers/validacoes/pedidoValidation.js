const Joi = require('joi');

const PedidoValidation = {
    indexAdmin: {
        query: {
            offset: Joi.number().required(),
            limit: Joi.number().required()
        }
    },
    showAdmin: {
        params: {
            id: Joi.string().alphanum().length(24).required()
        }
    },
    removeAdmin: {
        params: {
            id: Joi.string().alphanum().length().required()
        }
    },
    showCarrinhoPedidoAdmin: {
        params: {
            id: Joi.string().alphanum().length(24).required
        }
    }
}

module.exports = {
    PedidoValidation
}