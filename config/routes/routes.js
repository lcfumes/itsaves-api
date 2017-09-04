const BookmarkController = require('../../controllers/BookmarkController.js');
const UserController = require('../../controllers/UserController.js');
const LoginController = require('../../controllers/LoginController.js');

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
    method: 'GET',
    path: '/bookmark/{id}',
    config: BookmarkController.findBookmark,
  },
  {
    method: 'DELETE',
    path: '/bookmark/{id}',
    config: BookmarkController.deleteBookmark,
  },
  {
    method: 'POST',
    path: '/bookmark/create',
    config: BookmarkController.create,
  },
  {
    method: 'POST',
    path: '/user/authenticate',
    config: LoginController.authenticate
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
];