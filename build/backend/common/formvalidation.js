'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _hapiNode_modulesJoi = require('hapi/node_modules/joi');

var _hapiNode_modulesJoi2 = _interopRequireDefault(_hapiNode_modulesJoi);

exports['default'] = {
  schema: {
    name: _hapiNode_modulesJoi2['default'].string().max(50),
    email: _hapiNode_modulesJoi2['default'].string().email(),
    occupation: _hapiNode_modulesJoi2['default'].string().allow('').max(50),
    birthday: _hapiNode_modulesJoi2['default'].string().allow('').regex(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/)
  },
  checkBirthday: function checkBirthday(dateStr) {
    var now = new Date();
    var parts = dateStr.split('/');
    var day = parts[0];
    var month = parts[1] - 1;
    var year = parts[2];
    return new Date(year, month, day) < new Date(now.getFullYear() - 18, now.getMonth(), now.getDate());
  }
};
module.exports = exports['default'];
//# sourceMappingURL=../common/formvalidation.js.map