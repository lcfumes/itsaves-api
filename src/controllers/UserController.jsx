import Joi from 'joi';
import {UsersModel} from '../models/';

export default class BookmarkController {

  handleCreateUser(request, reply) {

    const user = {
    name: request.payload.name,
    email: request.payload.email,
    socialId: request.payload.socialId,
    type: request.payload.type,
  };
    
    UsersModel.setter('name', request.payload.name);
    UsersModel.setter('email', request.payload.email);
    UsersModel.setter('social_id', request.payload.socialId);
    UsersModel.setter('type', request.payload.type);

    UsersModel.insert((error, userId) => {
      if (!error) {
        return reply({
          userId
        }).code(200);
      }

      return reply().code(500);
    });  
  }

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
    // return {  
    //   method: 'GET',
    //   path: '/books/{id}',
    //   handler: function (request, reply) {

    //       db.books.update({
    //           _id: request.params.id
    //       }, {
    //           $set: request.payload
    //       }, function (err, result) {

    //           if (err) {
    //               return reply(Boom.wrap(err, 'Internal MongoDB error'));
    //           }

    //           if (result.n === 0) {
    //               return reply(Boom.notFound());
    //           }

    //           reply().code(204);
    //       });
    //   },
    //   config: {
    //       validate: {
    //           payload: Joi.object({
    //               title: Joi.string().min(10).max(50).optional(),
    //               author: Joi.string().min(10).max(50).optional(),
    //               isbn: Joi.number().optional()
    //           }).required().min(1)
    //       }
    //   }
    // }

}