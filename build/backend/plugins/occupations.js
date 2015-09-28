'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _hapiNode_modulesJoi = require('hapi/node_modules/joi');

var _hapiNode_modulesJoi2 = _interopRequireDefault(_hapiNode_modulesJoi);

var occupationList = ['software developer', 'HR manager', 'assessment reviewer'];

var occupations = {
  register: function register(server, options, next) {
    server.route({
      method: 'GET',
      path: '/occupations',
      config: {
        validate: {
          params: {
            filter: _hapiNode_modulesJoi2['default'].string().max(50)
          }
        }
      },
      handler: function handler(req, reply) {
        reply({
          occupations: occupationList.filter(function (occupation) {
            return occupation.indexOf(req.query.filter) !== -1;
          }).sort(function (a, b) {
            return a.toLowerCase() > b.toLowerCase();
          })
        });
      }
    });

    next();
  }
};

occupations.register.attributes = {
  name: 'occupations',
  version: '1.0.0'
};

exports['default'] = occupations;
module.exports = exports['default'];
//# sourceMappingURL=../plugins/occupations.js.map