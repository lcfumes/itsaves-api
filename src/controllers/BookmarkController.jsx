export default class BookmarkController {

  routes() {
    return [{
      method: 'GET',
      path: '/',
      handler: (request, reply) => {
        reply('It`s working!').code(200);
      }
    }];
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

}