import jwt from 'jsonwebtoken';
import ConfigService from '../services/ConfigService';

export default class Authentication {

  constructor(configService) {
    this.config = configService.getConfig();
  }

  static tokenAuthorization(server, options) {
    return {
      authenticate: (request, reply) => {
        const token = request.headers['x-access-token'];
        if (!token) {
          return reply().code(401);
        }
        const objConfigService = new ConfigService();
        const config = objConfigService.getConfig();
        jwt.verify(token, config.authentication.secret, (err, decoded) => {
          if (err) {
            return reply().code(401);
          }
          reply.continue({ credentials: decoded });
        })
      }
    };
  }

  sign(userEntity) {
    const user = userEntity.getUser();
    const token = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      id: user._embedded.id_user,
      name: user._embedded.name,
      email: user._embedded.email,
      social_id: user._embedded.social_id,
    }, this.config.authentication.secret);

    return token;
  }

}
