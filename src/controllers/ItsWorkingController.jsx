export default class ItsWorkingController {

  routes() {
    return [{
      method: 'GET',
      path: '/',
      handler: (request, reply) => {
        reply('It`s working!').code(200);
      }
    }];
  }

}