import React from '../../../../node_modules/react'
import Actions from '../modules/actions'
import AutoCompleteView from './autocomplete.jsx'
import Joi from '../../../../node_modules/hapi/node_modules/joi'
import formValidation from '../../../backend/common/formvalidation.js'

let validateForm = (formData, callback) => {
  let schema = Joi.object().keys(formValidation.schema)
  Joi.validate(formData, schema, {abortEarly: false}, function (err, value) {
    let errors = {}
    if (err) {
      errors = err.details.reduce((obj, curr) => {
        let key = curr.context.key
        let type = curr.type
        let msg = 'Invalid.'
        if (type === 'any.empty')
          msg = 'Required.'
        if (type === 'string.max')
          msg = 'Exceeds max length (' + curr.context.limit + ').'
        obj[key] = obj[key] || msg
        return obj
      }, {})
    }
    
    if (formData.birthday && !errors.birthday && !formValidation.checkBirthday(formData.birthday)) {
      errors.birthday = 'Age is less than 18'
    }
    
    callback(Object.keys(errors).length && errors)
  });
}

let FormView = React.createClass({
  getInitialState () {
    return {errors: null}
  },
  submit (e) {
    e.preventDefault()
    
    let formData = {
      name: this.refs.name.getDOMNode().value,
      email: this.refs.email.getDOMNode().value,
      occupation: this.refs.occupation.refs.input.getDOMNode().value,
      birthday: this.refs.birthday.getDOMNode().value
    }

    validateForm(formData, errors => {
      if (errors) {
        this.setState({errors: errors})
        return
      }
      this.setState({errors: null})
      
      Actions.FormAction('validate', formData)
    })
  },
  render () {
    let gridClass = 'small-12 medium-6 small-centered columns'
    let getErrorClass = key => this.state.errors && this.state.errors[key] && ' error' || ''
    let getErrorLabel = key => this.state.errors && this.state.errors[key] && (<small className="error">{this.state.errors[key]}</small>)

    return (
      <div>
        <form onSubmit={this.submit}>
          <div className="row">
            <div className={gridClass}>
              <h1>Enter your data</h1>
            </div>
          </div>
          <div className="row">
            <div className={gridClass + getErrorClass('name')}>
              <label>Name
                <input type="text" placeholder="John Doe" ref="name" />
              </label>
              {getErrorLabel('name')}
            </div>
          </div>
          <div className="row">
            <div className={gridClass + getErrorClass('email')}>
              <label>Email
                <input type="text" placeholder="john.doe@example.com" ref="email" />
              </label>
              {getErrorLabel('email')}
            </div>
          </div>
          <div className="row">
            <div className={gridClass + getErrorClass('occupation')}>
              <label>Occupation
                <AutoCompleteView placeholder="software engineer" ref="occupation" />
              </label>
              {getErrorLabel('occupation')}
            </div>
          </div>
          <div className="row">
            <div className={gridClass + getErrorClass('birthday')}>
              <label>Birthday
                <input type="text" placeholder="30/12/1978" ref="birthday" />
              </label>
              {getErrorLabel('birthday')}
            </div>
          </div>
          <div className="row">
            <div className={gridClass + ' clearfix'}>
              <input className="button right" type="submit" value="Send" />
            </div>
          </div>
        </form>
      </div>
    )
  }
})

export default FormView
