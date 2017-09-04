const BookmarkController = require('../../controllers/BookmarkController.js');
const UserController = require('../../controllers/UserController.js');

module.exports = [
  { 
    method: 'GET',
    path: '/',
    config: BookmarkController.itsWorking,
  },
  {
    method: 'GET',
    path: '/bookmark/all',
    config: BookmarkController.getAll,
  },
  {
    method: 'POST',
    path: '/bookmark/create',
    config: BookmarkController.create,
  },
  {
    method: 'GET',
    path: '/user',
    config: UserController.getUser
  },
  {
    method: 'POST',
    path: '/user/create',
    config: UserController.create
  },
  // { 
  //   method: 'GET', 
  //   path: '/{hash}', 
  //   config: UrlController.urlFindConfig
  // },
  // { 
  //   method: 'POST', 
  //   path: '/',
  //   config: UrlController.urlCreateConfig
  // },
  // { 
  //   method: 'PUT', 
  //   path: '/{hash}',
  //   config: UrlController.urlUpdateConfig
  // },
  // { 
  //   method: 'DELETE', 
  //   path: '/{hash}', 
  //   config: UrlController.urlDeleteConfig
  // },
  // {
  //   method: 'GET',
  //   path: '/redirect/{hash}',
  //   config: UrlController.urlFindToRedirectConfig
  // },
  // {
  //   method: 'POST',
  //   patch: '/user/create',
  //   config: UserController.createUser
  // }
];