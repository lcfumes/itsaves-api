const bookmarkModel = require('../models/BookmarkModel');
const bookmarkEntity = require('../entities/BookmarkEntity');
const Joi = require('joi');

/* Without Authentication */
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

/* With Authentication */
module.exports.handlerFindBookmark = (request, reply) => {
  // eslint-disable-next-line consistent-return
  request.server.auth.test('token', request, (errAuth, credentials) => {
    if (errAuth) {
      // eslint-disable-next-line no-console
      console.log(errAuth);
      return reply().code(500);
    }
    bookmarkModel.findByUserAndId(credentials.id, request.params.id, (err, doc) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log(err);
        return reply().code(500);
      }
      if (!doc) {
        return reply({}).code(404);
      }
      return reply(doc).code(200);
    });
  });
};

module.exports.findBookmark = {
  auth: 'token',
  handler: this.handlerFindBookmark,
  description: 'Returns one specific bookmark of user',
  notes: 'Returns total and bookmark of user if found',
  tags: ['api', 'bookmarks', 'list'],
  validate: {
    params: {
      id: Joi.string().required().description('Bookmark ID'),
    },
    headers: Joi.object().keys({
      'content-type': Joi.string().required().valid(['application/json']).default('application/json'),
      'x-access-token': Joi.string().required().description('Auth Token'),
    }).unknown(),
  },
};

module.exports.handlerCreate = (request, reply) => {
  request.server.auth.test('token', request, (err, credentials) => {
    const bookmark = {
      userId: credentials.id,
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
  auth: 'token',
  handler: this.handlerCreate,
  description: 'Create a new bookmark',
  notes: 'Create a new bookmark and returns all the information',
  tags: ['api', 'bookmark', 'create'],
  validate: {
    headers: Joi.object().keys({
      'content-type': Joi.string().required().valid(['application/json']).default('application/json'),
      'x-access-token': Joi.string().required().description('Auth Token'),
    }).unknown(),
    payload: {
      url: Joi.string().min(1).required().description('URL'),
      title: Joi.string().min(1).required().description('Url Title'),
      description: Joi.string().min(1).description('Description'),
    },
  },
};

module.exports.handlerDeleteBookmark = (request, reply) => {
  // eslint-disable-next-line consistent-return
  request.server.auth.test('token', request, (errAuth, credentials) => {
    if (errAuth) {
      // eslint-disable-next-line no-console
      console.log(errAuth);
      return reply().code(500);
    }
    bookmarkModel.deleteByUserAndId(credentials.id, request.params.id, (err, removed) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log(err);
        return reply().code(500);
      }
      if (!removed) {
        return reply().code(204);
      }
      return reply().code(202);
    });
  });
};

module.exports.deleteBookmark = {
  auth: 'token',
  handler: this.handlerDeleteBookmark,
  description: 'Delete an bookmark',
  notes: 'Delete an bookmark',
  tags: ['api', 'bookmark', 'delete'],
  validate: {
    params: {
      id: Joi.string().required().description('Bookmark ID'),
    },
    headers: Joi.object().keys({
      'content-type': Joi.string().required().valid(['application/json']).default('application/json'),
      'x-access-token': Joi.string().required().description('Auth Token'),
    }).unknown(),
  },
};
