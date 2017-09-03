const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({
  port: 3300,
  routes: {
    cors: true,
  },
});

const env = process.env.NODE_ENV;
if (env === undefined) {
  /* eslint-disable no-console */
  console.log('ENV not declared. Config file cannot be found.');
  process.exit(1);
}

const configFile = `./config/config.${env}.json`;
/* eslint-disable import/no-dynamic-require */
const config = require(configFile);
const mongoose = require('mongoose');
const good = require('good');
const routes = require('./config/routes/routes.js');

mongoose.connect(config.database.connection);

const options = {
  ops: {
    interval: 1000,
  },
  reporters: {
    myConsoleReporter: [{
      module: 'good-squeeze',
      name: 'Squeeze',
      args: [{ log: '*', response: '*' }],
    }, {
      module: 'good-console',
    }, 'stdout'],
    myFileReporter: [{
      module: 'good-squeeze',
      name: 'Squeeze',
      args: [{ ops: '*' }],
    }, {
      module: 'good-squeeze',
      name: 'SafeJson',
    }],
    myHTTPReporter: [{
      module: 'good-squeeze',
      name: 'Squeeze',
      args: [{ error: '*' }],
    }],
  },
};

server.register({
  register: good,
  options,
}, (err) => {
  if (err) {
    console.log(err);
  } else {
    server.route(routes);
    server.start(() => {
      console.log(`Server running at: ${server.info.uri}`);
    });
  }
});
