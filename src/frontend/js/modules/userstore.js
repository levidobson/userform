import {EventEmitter} from 'events'
import {assign} from '../../../../node_modules/lodash'
import AppDispatcher from './dispatcher'
import request from '../../../../node_modules/superagent'

var UserStore = assign({}, EventEmitter.prototype, {
  validate (formData) {
    request
      .post('/validate')
      .send(formData)
      .end((err, res) => {
        if (err) {
          return UserStore.emit('error');
        }
        UserStore.emit('success');
      })
  }
})

UserStore.dispatchToken = AppDispatcher.register((payload) => {
  switch (payload.action) {
    case 'form_validate':
      UserStore.validate(payload.options)
      break
    default:
  }
})

export default UserStore
