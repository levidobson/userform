'use strict';

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

var _hapi = require('hapi');

var hapi = _interopRequireWildcard(_hapi);

var _path = require('path');

var path = _interopRequireWildcard(_path);

var _sourceMapSupport = require('source-map-support');

var sourceMapSupport = _interopRequireWildcard(_sourceMapSupport);

sourceMapSupport.install();

var server = new hapi.Server({
  debug: {
    request: ['error']
  }
});

var inProduction = process.env.NODE_ENV === 'production';

var port = process.env.APP_PORT || 8000;
var host = process.env.APP_HOST || 'localhost';

server.connection({
  port: port,
  host: host
});

var plugins = [require('inert'), // for static files
require('vision'), // for views
require('./plugins/root'), require('./plugins/occupations'), require('./plugins/validate')];

if (!inProduction) {
  plugins.push(require('./plugins/fileserver')); // serve static files
  plugins.push(require('./plugins/swagger-route')); // serve swagger files
}

server.register(plugins, function (err) {
  if (err) {
    return console.error('Failed to load plugin: ', err);
  }
  server.start(function (err) {
    if (err) {
      return console.error('Failed to start server: ', err);
    }

    // server.plugins.swagger.setHost(server.info.host + ':' + server.info.port)
    console.log('Server started. Host: ' + host + ', port: ' + port);
  });
});

server.views({
  engines: {
    html: require('handlebars')
  },
  isCached: false,
  path: path.join(__dirname, 'views')
});
//# sourceMappingURL=server.js.map