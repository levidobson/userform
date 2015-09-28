import * as path from 'path'

var createRoute = (server, folder) => {
  server.route({
    method: 'GET',
    path: '/' + folder + '/{filename}',
    handler (req, reply) {
      var filePath = path.join(__dirname, '../../frontend/', folder, req.params.filename)
      reply.file(filePath)
    }
  })
}

var fileServer = {
  register (server, options, next) {
    createRoute(server, 'css')
    createRoute(server, 'js')

    next()
  }
}

fileServer.register.attributes = {
  name: 'fileServer',
  version: '1.0.0'
}

module.exports = exports = fileServer
