import Joi from 'joi';
import { UsersModel } from '../models/';
import UserEntity from '../entities/UserEntity';
import ConfigService from '../services/ConfigService';
import AuthService from '../services/AuthService';

export default class UserController {

  routes() {
    return [{
      method: 'POST',
      path: '/user/create',
      handler: this.handleCreateUser,
      config: {
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
      },
    }];
  }

  handleCreateUser(request, reply) {    
    UsersModel.setter('name', request.payload.name);
    UsersModel.setter('email', request.payload.email);
    UsersModel.setter('social_id', request.payload.socialId);
    UsersModel.setter('type', request.payload.type);

    UsersModel.insert((error, created) => {
      if (error) {
        return reply().code(500);
      }

      const objUser = UsersModel.get();

      if (created === false) {
        return reply({
          status: 'User already exists [social_id]',
        }).code(409);
      }

      const objUserEntity = new UserEntity();
      objUserEntity.setUser(objUser);

      const objConfigService = new ConfigService();
      const objAuthService = new AuthService(objConfigService);

      const token = objAuthService.sign(objUserEntity);
      objUserEntity.setToken(token);

      return reply(objUserEntity.getUser()).code(201);
    });  
  }
}