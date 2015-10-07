import Boom from 'hapi/node_modules/boom'
import formValidation from '../common/formvalidation.js'

var validate = {
  register (server, options, next) {
    server.route({
      method: 'POST',
      path: '/validate',
      config: {
        validate: {
          options: { abortEarly: false },
          payload: formValidation.schema
        }
      },
      handler (req, reply) {
        var userData = req.payload
        if (userData.birthday && !formValidation.checkBirthday(userData.birthday)) {
          return reply(Boom.badRequest('Age is less than 18'))
        }

        reply({message: 'Validation successful'}).code(200)
      }
    })

    next()
  }
}

validate.register.attributes = {
  name: 'validate',
  version: '1.0.0'
}

export default validate
