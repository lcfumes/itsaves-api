import jwt from 'jsonwebtoken';

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
        jwt.verify(token, this.config.authentication.secret, (err, decoded) => {
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
      id: user.id_user,
      name: user.name,
      email: user.email,
      social_id: user.social_id,
    }, this.config.authentication.secret);

    return token;
  }

}
