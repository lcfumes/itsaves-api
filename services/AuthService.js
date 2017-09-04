const jwt = require('jsonwebtoken');

module.exports.tokenAuthorization = (server, options) => {
  return {
    authenticate: (request, reply) => {
      const token = request.headers['x-access-token'];
      if (!token) {
        return reply().code(401);
      }
      jwt.verify(token, Config.authentication.secret, (err, decoded) => {
        if (err) {
          return reply().code(401);
        }
        reply.continue({ credentials: decoded });
      })
    }
  };
};