import Joi from 'joi';
import BookmarksEntity from '../entities/BookmarksEntity';
import { BookmarksModel } from '../models/';

export default class BookmarkController {

  routes() {
    return [{
      method: 'POST',
      path: '/bookmark/create',
      handler: this.handleCreateBookmark,
      config: {
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
      },
    },
    {
      method: 'GET',
      path: '/bookmark/all',
      handler: this.handleGetAllBookmark,
      config: {
        description: 'Get all bookmarks',
        notes: 'Get all bookmarks',
        tags: ['api', 'bookmark', 'all'],
        validate: {
          headers: Joi.object().keys({
            'x-access-token': Joi.string().required().description('Auth Token'),
          }).unknown(),
        },
      },
    },
    {
      method: 'GET',
      path: '/bookmark/{id}',
      handler: this.handleGetBookmark,
      config: {
        description: 'Get a bookmarks',
        notes: 'Get a bookmarks',
        tags: ['api', 'bookmark', 'get'],
        validate: {
          headers: Joi.object().keys({
            'x-access-token': Joi.string().required().description('Auth Token'),
          }).unknown(),
          params: {
            id: Joi.string().required().description('Bookmark ID'),
          },
        },
      },
    },
    {
      method: 'DELETE',
      path: '/bookmark/{id}',
      handler: this.handleDeleteBookmark,
      config: {
        description: 'Delete a bookmarks',
        notes: 'Delete a bookmarks',
        tags: ['api', 'bookmark', 'delete'],
        validate: {
          headers: Joi.object().keys({
            'x-access-token': Joi.string().required().description('Auth Token'),
          }).unknown(),
          params: {
            id: Joi.string().required().description('Bookmark ID'),
          },
        },
      },
    }];
  }

  handleCreateBookmark(request, reply) {    
    request.server.auth.test('token', request, (err, credentials) => {
      const bookmark = {
        fk_user: credentials.id,
        url: request.payload.url,
        title: request.payload.title,
        description: request.payload.description,
      };
      BookmarksModel.setIdUser(credentials.id);
      BookmarksModel.insert(bookmark, (errCreate, result, created) => {
        if (errCreate) {
          console.log(errCreate);
          return reply().code(500);
        }
        if (!created) {
          return reply({
            succes: false,
            message: 'URL already saved.',
          }).code(409);
        }
        const objBookmarksEntity = new BookmarksEntity();
        objBookmarksEntity.setBookmarks(result);
        return reply(objBookmarksEntity.getBookmarks()).code(201);
      });
    });
  }

  handleGetAllBookmark(request, reply) {
    request.server.auth.test('token', request, (err, credentials) => {
      BookmarksModel.setIdUser(credentials.id);
      BookmarksModel.findAll((err, result) => {
        if (err) {
          console.log(err);
          return reply().code(500);
        }

        const objBookmarksEntity = new BookmarksEntity();
        objBookmarksEntity.setBookmarks(result);

        return reply(objBookmarksEntity.getBookmarks()).code(200);
      });
    });
  }

  handleGetBookmark(request, reply) {
    request.server.auth.test('token', request, (err, credentials) => {
      BookmarksModel.setIdUser(credentials.id);
      BookmarksModel.findById(request.params.id, (err, result) => {
        if (err) {
          console.log(err);
          return reply().code(500);
        }

        const objBookmarksEntity = new BookmarksEntity();
        objBookmarksEntity.setBookmarks(result);

        return reply(objBookmarksEntity.getBookmarks()).code(200);
      });
    });
  }

  handleDeleteBookmark(request, reply) {
    request.server.auth.test('token', request, (err, credentials) => {
      BookmarksModel.setIdUser(credentials.id);
      BookmarksModel.deleteById(request.params.id, (err, removed) => {
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
  }

}