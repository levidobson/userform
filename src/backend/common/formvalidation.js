import Joi from 'hapi/node_modules/joi'

export default {
  schema: {
    name: Joi.string().max(50),
    email: Joi.string().email(),
    occupation: Joi.string().allow('').max(50),
    birthday: Joi.string().allow('').regex(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/)
  },
  checkBirthday (dateStr) {
    let now = new Date()
    let parts = dateStr.split('/')
    let day = parts[0]
    let month = parts[1] - 1
    let year = parts[2]
    return new Date(year, month, day) < new Date(now.getFullYear() - 18, now.getMonth(), now.getDate())
  }
}
