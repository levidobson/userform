var root = {
  register (server, options, next) {
    server.route({
      method: 'GET',
      path: '/',
      handler (req, reply) {
        reply.view('index')
      }
    })

    next()
  }
}

root.register.attributes = {
  name: 'root',
  version: '1.0.0'
}

export default root
