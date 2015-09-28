'use strict';

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

var _path = require('path');

var path = _interopRequireWildcard(_path);

var defaultUrl = '/api-test/?url=/api-docs';

var swaggerRoute = {
  register: function register(server, options, next) {
    // redirect to default url
    server.route({
      method: 'GET',
      path: '/api-test',
      handler: function handler(req, reply) {
        reply.redirect(defaultUrl);
      }
    });

    server.route({
      method: 'GET',
      path: '/api-test/{filename*}',
      handler: function handler(req, reply) {
        if (!req.params.filename && !req.query.url) {
          return reply.redirect(defaultUrl);
        }

        var filePath = path.resolve('node_modules/swagger-ui/dist/', req.params.filename || 'index.html');
        reply.file(filePath);
      }
    });

    next();
  }
};

swaggerRoute.register.attributes = {
  name: 'swaggerRoute',
  version: '1.0.0'
};

module.exports = exports = swaggerRoute;
//# sourceMappingURL=../plugins/swagger-route.js.map