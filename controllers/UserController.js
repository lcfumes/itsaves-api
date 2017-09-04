const userModel = require('../models/UserModel');
const userEntity = require('../entities/UserEntity');
const Joi = require('joi');

module.exports.handlerGetUser = (request, reply) => {
  userModel.findBySocialId(request.headers.socialid, (err, doc) => {
    if (!err) {
      return reply(doc).code(200);
    }
    return reply({}).code(404);
  });
};

module.exports.getUser = {
  handler: this.handlerGetUser,
  description: 'Get user information',
  notes: 'Get user information',
  tags: ['api', 'users', 'get'],
};

module.exports.handlerCreate = (request, reply) => {
  const user = {
    name: request.payload.name,
    email: request.payload.email,
    socialId: request.payload.socialId,
    type: request.payload.type,
  };
  userModel.create(user, (err, result, created) => {
    if (err) {
      return reply().code(500);
    }
    if (!created) {
      return reply({
        succes: false,
        message: 'Email address already exists.',
      }).code(409);
    }
    userEntity.setUsers(result);
    return reply(userEntity.getUsers()).code(201);
  });
};

module.exports.create = {
  handler: this.handlerCreate,
  description: 'Create a new user',
  notes: 'Create a new user and returns all the information',
  tags: ['api', 'users', 'create'],
  validate: {
    headers: Joi.object().keys({
      'content-type': Joi.string().required().valid(['application/json']).default('application/json'),
    }).unknown(),
    payload: {
      name: Joi.string().min(1).required().description('Name'),
      email: Joi.string().min(1).required().description('Email'),
      socialId: Joi.string().min(1).required().description('Social ID'),
      type: Joi.string().min(1).description('Type'),
    },
  },
};
