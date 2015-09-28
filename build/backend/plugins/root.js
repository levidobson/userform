'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var root = {
  register: function register(server, options, next) {
    server.route({
      method: 'GET',
      path: '/',
      handler: function handler(req, reply) {
        reply.view('index');
      }
    });

    next();
  }
};

root.register.attributes = {
  name: 'root',
  version: '1.0.0'
};

exports['default'] = root;
module.exports = exports['default'];
//# sourceMappingURL=../plugins/root.js.map