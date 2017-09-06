const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');

const server = new Hapi.Server();
server.connection({
  port: 3333,
  routes: {
    cors: true,
  },
});

const env = process.env.NODE_ENV;
if (env === undefined) {
  // eslint-disable-next-line no-console
  console.log('ENV not declared. Config file cannot be found.');
  process.exit(1);
}

const configFile = `./config/config.${env}.json`;
// eslint-disable-next-line import/no-dynamic-require
const config = require(configFile);
const mongoose = require('mongoose');
const Routes = require('./config/routes/routes.js');

global.Config = config;

mongoose.connect(config.database.connection);

const AuthService = require('./services/AuthService');

server.auth.scheme('custom', AuthService.tokenAuthorization);
server.auth.strategy('token', 'custom');
server.route(Routes);

if (env === 'development') {
  server.register([
    Inert,
    Vision,
    {
      register: HapiSwagger,
      options: {
        info: {
          title: 'It Saves API Documentation',
          version: Pack.version,
        },
      },
    },
  ],
  () => {
    server.start((err) => {
      if (err) {
        throw err;
      }
      // eslint-disable-next-line no-console
      console.log(`Server running at: ${server.info.uri}`);
    });
  });
} else {
  server.start((err) => {
    if (err) {
      throw err;
    }
    // eslint-disable-next-line no-console
    console.log(`Server running at: ${server.info.uri}`);
  });
}
