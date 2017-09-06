const categoryModel = require('../models/CategoryModel');
const categoryEntity = require('../entities/CategoryEntity');
const Joi = require('joi');

/* Without Authentication */


/* With Authentication */
module.exports.handlerCreate = (request, reply) => {
  request.server.auth.test('token', request, (err, credentials) => {
    const category = {
      userId: credentials.id,
      name: request.payload.name,
      description: request.payload.description,
    };
    categoryModel.create(credentials.id, category, (errCreate, result, created) => {
      if (errCreate) {
        return reply().code(500);
      }
      if (!created) {
        return reply({
          succes: false,
          message: 'Category already exists.',
        }).code(409);
      }
      categoryEntity.setCategories(result);
      return reply(categoryEntity.getCategories()).code(201);
    });
  });
};

module.exports.create = {
  auth: 'token',
  handler: this.handlerCreate,
  description: 'Create a new category',
  notes: 'Create a new category and returns all the information',
  tags: ['api', 'category', 'create'],
  validate: {
    headers: Joi.object().keys({
      'content-type': Joi.string().required().valid(['application/json']).default('application/json'),
      'x-access-token': Joi.string().required().description('Auth Token'),
    }).unknown(),
    payload: {
      name: Joi.string().min(1).required().description('Name'),
      description: Joi.string().min(1).description('Description'),
    },
  },
};
