const Joi = require('joi');

const groupeSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  userIds: Joi.array().items(Joi.number().integer()).optional() // Liste d'IDs d'utilisateurs
});

module.exports = groupeSchema;