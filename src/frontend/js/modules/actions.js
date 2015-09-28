import AppDispatcher from './dispatcher'

var Actions = {
  FormAction (action, options) {
    AppDispatcher.dispatch({
      action: 'form_' + action,
      options: options
    })
  },
  AutoCompleteAction (action, options) {
    AppDispatcher.dispatch({
      action: 'autocomplete_' + action,
      options: options
    })    
  }
}

export default Actions
