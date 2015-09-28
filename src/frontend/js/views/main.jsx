import React from '../../../../node_modules/react'
import UserStore from '../modules/userstore'
import Actions from '../modules/actions'
import FormView from './form.jsx'

let MainView = React.createClass({
  getInitialState () {
    return {success: null}
  },
  componentDidMount () {
    UserStore.on("success", this.validationSuccess)
    UserStore.on("error", this.validationError)
  },
  componentWillUnmount () {
    UserStore.removeListener("success", this.validationSuccess)
    UserStore.removeListener("error", this.validationError)
  },
  validationSuccess () {
    this.setState({success: true})
  },
  validationError () {
    this.setState({success: false})
  },
  back () {
    this.setState({success: null})
  },
  render () {
    return (
      <div>
        { this.state.success ?
          (
            <div className="row">
              <div className="small-12 medium-6 small-centered columns">
                <h1>Success!</h1>
                <a href="javascript:" onClick={this.back}>Go back</a>
              </div>
            </div>
          )
        : this.state.success === false ?
          (
            <div className="row">
              <div className="small-12 medium-6 small-centered columns">
                <h1>An error occurred.</h1>
                <a href="javascript:" onClick={this.back}>Go back</a>
              </div>
            </div>
          )
        :
          <FormView />
        }      
      </div>
    )
  }
})

export default MainView
