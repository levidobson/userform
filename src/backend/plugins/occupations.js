import Joi from 'hapi/node_modules/joi'

var occupationList = ['software developer', 'HR manager', 'assessment reviewer']

var occupations = {
  register (server, options, next) {
    server.route({
      method: 'GET',
      path: '/occupations',
      config: {
        validate: {
          params: {
            filter: Joi.string().max(50)
          }
        }
      },
      handler (req, reply) {
        reply({
          occupations: occupationList
            .filter(occupation => occupation.indexOf(req.query.filter) !== -1)
            .sort((a, b) => a.toLowerCase() > b.toLowerCase())
        })
      }
    })

    next()
  }
}

occupations.register.attributes = {
  name: 'occupations',
  version: '1.0.0'
}

export default occupations
