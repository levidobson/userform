'use strict';

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

var _path = require('path');

var path = _interopRequireWildcard(_path);

var createRoute = function createRoute(server, folder) {
  server.route({
    method: 'GET',
    path: '/' + folder + '/{filename}',
    handler: function handler(req, reply) {
      var filePath = path.join(__dirname, '../../frontend/', folder, req.params.filename);
      reply.file(filePath);
    }
  });
};

var fileServer = {
  register: function register(server, options, next) {
    createRoute(server, 'css');
    createRoute(server, 'js');

    next();
  }
};

fileServer.register.attributes = {
  name: 'fileServer',
  version: '1.0.0'
};

module.exports = exports = fileServer;
//# sourceMappingURL=../plugins/fileserver.js.map