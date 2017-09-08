import Hapi from 'hapi';
import Inert from 'inert';
import Vision from 'vision';
import HapiSwagger from 'hapi-swagger';
import Pack from '../package';
import ConfigService from './services/ConfigService';
import AuthService from './services/AuthService';
import Routes from './config/routes/routes';

const server = new Hapi.Server();
server.connection({
  port: 3333,
  routes: {
    cors: true,
  },
});

const objConfigService = new ConfigService();

server.auth.scheme('custom', AuthService.tokenAuthorization);
server.auth.strategy('token', 'custom');

server.route(Routes);

if (objConfigService.getEnv() === 'development') {
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
