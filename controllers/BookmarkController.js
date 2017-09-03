const bookmarkModel = require('../models/BookmarkModel');

module.exports.handlerItsWorking = (request, reply) => {
  reply("It's working").code(200);
};

module.exports.itsWorking = {
  handler: this.handlerItsWorking,
};

module.exports.handlerGetAll = (request, reply) => {
  const page = request.query.page ? request.query.page : 0;
  const total = request.query.total ? request.query.total : 10;

  bookmarkModel.findAll(page, total, (doc) => {
    reply(doc);
  });
};

module.exports.getAll = {
  handler: this.handlerGetAll,
};
