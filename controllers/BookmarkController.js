const bookmarkModel = require('../models/BookmarkModel');
const userModel = require('../models/UserModel');
const bookmarkEntity = require('../entities/BookmarkEntity');
const Joi = require('joi');

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
    bookmarkEntity.setBookmarks(doc);
    reply(bookmarkEntity.getBookmarks()).code(200);
  });
};

module.exports.getAll = {
  handler: this.handlerGetAll,
  description: 'Get all Bookmarks',
  notes: 'List all bookmarks. Params: page, total',
  tags: ['api', 'bookmark', 'getAll'],
  validate: {
    query: {
      page: Joi.number().min(1).description('URL'),
      total: Joi.number().min(1).description('Url Title'),
    },
  },
};

module.exports.handlerCreate = (request, reply) => {
  userModel.findById(request.headers.userid, (err, doc) => {
    /* eslint-disable no-underscore-dangle */
    const userId = doc._id;
    const bookmark = {
      userId,
      url: request.payload.url,
      title: request.payload.title,
      description: request.payload.description,
    };
    bookmarkModel.create(bookmark, (errCreate, result, created) => {
      if (errCreate) {
        return reply().code(500);
      }
      if (!created) {
        return reply({
          succes: false,
          message: 'URL already saved.',
        }).code(409);
      }
      bookmarkEntity.setBookmarks(result);
      return reply(bookmarkEntity.getBookmarks()).code(201);
    });
  });
};

module.exports.create = {
  handler: this.handlerCreate,
  description: 'Create a new bookmark',
  notes: 'Create a new bookmark and returns all the information',
  tags: ['api', 'bookmark', 'create'],
  validate: {
    headers: Joi.object().keys({
      'content-type': Joi.string().required().valid(['application/json']).default('application/json'),
      userid: Joi.string().min(1).required().description('User ID'),
    }).unknown(),
    payload: {
      url: Joi.string().min(1).required().description('URL'),
      title: Joi.string().min(1).required().description('Url Title'),
      description: Joi.string().min(1).description('Description'),
    },
  },
};
