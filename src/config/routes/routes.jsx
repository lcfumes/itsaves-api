import _ from 'lodash';

import ItsWorkingController from '../../controllers/ItsWorkingController';
import UserController from '../../controllers/UserController';
import BookmarkController from '../../controllers/BookmarkController';

const importControllers = [
  ItsWorkingController,
  UserController,
  BookmarkController,
];

const routes = [];

_.map(importControllers, (controller) => {
  const objController = new controller();
  _.map(objController.routes(), (route) => {
    routes.push(route);
  });
})

module.exports = routes;
