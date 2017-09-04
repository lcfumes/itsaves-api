/* global Config */

const Joi = require('joi');
const jwt = require('jsonwebtoken');
const userModel = require('../models/UserModel');
const userEntity = require('../entities/UserEntity');

module.exports.handlerAuthenticate = (request, reply) => {
  // eslint-disable-next-line consistent-return
  userModel.findBySocialIdAndType(request.payload.socialId, request.payload.type, (err, user) => {
    if (err) {
      return reply().code(500);
    }
    if (!user) {
      return reply().code(404);
    }
    const token = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      id: user.id,
      name: user.name,
      email: user.email,
      socialId: user.socialId,
    }, Config.authentication.secret);
    userEntity.setUsers(user);
    userEntity.setToken(token);
    reply(userEntity.getUsers()).code(200);
  });
};

module.exports.authenticate = {
  handler: this.handlerAuthenticate,
  description: 'Authenticate User',
  notes: 'Authenticate a user and return one token if found',
  tags: ['api', 'users', 'authenticate'],
  validate: {
    payload: {
      socialId: Joi.string().required().description('socialId'),
      type: Joi.string().required().description('type'),
    },
    headers: Joi.object().keys({
      'content-type': Joi.string().required().valid(['application/json']).default('application/json'),
    }).unknown(),
  },
};
