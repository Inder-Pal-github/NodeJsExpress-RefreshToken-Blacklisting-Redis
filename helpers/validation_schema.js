const Joi = require("@hapi/joi");
const joi = require("@hapi/joi");

const AuthSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(2).required(),
});

module.exports = {
  AuthSchema,
};
