import * as path from 'path'

const defaultUrl = '/api-test/?url=/api-docs'

var swaggerRoute = {
  register (server, options, next) {
    // redirect to default url
    server.route({
      method: 'GET',
      path: '/api-test',
      handler (req, reply) {
        reply.redirect(defaultUrl)
      }
    })

    server.route({
      method: 'GET',
      path: '/api-test/{filename*}',
      handler (req, reply) {
        if (!req.params.filename && !req.query.url) {
          return reply.redirect(defaultUrl)
        }

        var filePath = path.resolve('node_modules/swagger-ui/dist/', req.params.filename || 'index.html')
        reply.file(filePath)
      }
    })

    next()
  }
}

swaggerRoute.register.attributes = {
  name: 'swaggerRoute',
  version: '1.0.0'
}

module.exports = exports = swaggerRoute
