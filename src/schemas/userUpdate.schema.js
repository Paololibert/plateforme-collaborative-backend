const Joi = require('joi');

const userUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  firstname: Joi.string().min(2).max(50),
  email: Joi.string().email(),
  password: Joi.string().min(6).optional(),
}).min(1);

module.exports = userUpdateSchema;
