'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _hapiNode_modulesJoi = require('hapi/node_modules/joi');

var _hapiNode_modulesJoi2 = _interopRequireDefault(_hapiNode_modulesJoi);

var _hapiNode_modulesBoom = require('hapi/node_modules/boom');

var _hapiNode_modulesBoom2 = _interopRequireDefault(_hapiNode_modulesBoom);

var _commonFormvalidationJs = require('../common/formvalidation.js');

var _commonFormvalidationJs2 = _interopRequireDefault(_commonFormvalidationJs);

var validate = {
  register: function register(server, options, next) {
    server.route({
      method: 'POST',
      path: '/validate',
      config: {
        validate: {
          options: { abortEarly: false },
          payload: _commonFormvalidationJs2['default'].schema
        }
      },
      handler: function handler(req, reply) {
        var userData = req.payload;
        if (userData.birthday && !_commonFormvalidationJs2['default'].checkBirthday(userData.birthday)) {
          return reply(_hapiNode_modulesBoom2['default'].badRequest('Age is less than 18'));
        }

        reply({ message: 'Validation successful' }).code(200);
      }
    });

    next();
  }
};

validate.register.attributes = {
  name: 'validate',
  version: '1.0.0'
};

exports['default'] = validate;
module.exports = exports['default'];
//# sourceMappingURL=../plugins/validate.js.map