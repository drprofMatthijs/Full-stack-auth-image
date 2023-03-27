const Joi = require("joi");
//const passwordComplexity = require('joi-password-complexity');


const registerAuthSchema = Joi.object({
    email : Joi.string().email().lowercase().required(),
    password: Joi.string().min(2).required(),
    confirmPassword: Joi.string().required().valid(Joi.ref('password'))
});

const loginAuthSchema = Joi.object({
    email : Joi.string().email().lowercase().required(),
    password: Joi.string().min(2).required(),
});



module.exports = {
    registerAuthSchema,
    loginAuthSchema
}