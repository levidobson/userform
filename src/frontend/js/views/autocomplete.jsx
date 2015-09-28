import React from '../../../../node_modules/react'
import OccupationStore from '../modules/occupationstore'
import Actions from '../modules/actions'

let AutoCompleteView = React.createClass({
  getInitialState () {
    return {suggestions: [], hidden: true, loading: false, selectedIdx: -1, originalText: '', displayText: ''}
  },
  componentDidMount () {
    OccupationStore.on("suggestions", this.onSuggestions)
    OccupationStore.on("suggestionError", this.onSuggestionError)
  },
  componentWillUnmount () {
    OccupationStore.removeListener("suggestions", this.onSuggestions)
    OccupationStore.removeListener("suggestionError", this.onSuggestionError)
  },
  onSuggestions (suggestions) {
    this.setState({suggestions: suggestions, hidden: false, loading: false, idx: -1})
  },
  onSuggestionError () {
    this.setState({suggestions: ['An error occurred.'], hidden: false, loading: false})
  },
  onChange (e) {
    let text = this.refs.input.getDOMNode().value
    if (text) {
      this.setState({originalText: text, displayText: text, loading: true})
    } else {
      this.setState({originalText: text, displayText: text, hidden: true, loading: false})
    }
    Actions.AutoCompleteAction('change', text)
  },
  onKeyDown (e) {
    let newIdx
    let text
    switch (e.which) {
      case 38:
        e.preventDefault()
        if (this.state.loading) {
          break
        }
        newIdx = this.state.hidden ? -1 : (this.state.idx > -1 ? this.state.idx - 1 : this.state.suggestions.length - 1)
        text = newIdx === -1 ? this.state.originalText : this.state.suggestions[newIdx]
        this.setState({hidden: false, loading: false, idx: newIdx, displayText: text})
        break
      case 40:
        e.preventDefault()
        if (this.state.loading) {
          break
        }
        newIdx = this.state.hidden ? -1 : (this.state.idx < this.state.suggestions.length - 1 ? this.state.idx + 1 : - 1)
        text = newIdx === -1 ? this.state.originalText : this.state.suggestions[newIdx]
        this.setState({hidden: false, loading: false, idx: newIdx, displayText: text})
        break
      case 13:
        e.preventDefault()
        this.setState({hidden: true, loading: false, originalText: this.state.displayText})
        break
      case 27:
        e.preventDefault()
        this.setState({hidden: true, loading: false, displayText: this.state.originalText})
        break
      default:
    }
  },
  getSuggestionList () {
    if (this.state.hidden || !this.state.suggestions.length) {
      return null
    }
    let suggestions = this.state.suggestions
    return (
      <ul className="suggestions">
        {suggestions.map((suggestion, idx) => {
          let className = idx === this.state.idx ? 'selected' : ''
          return <li key={suggestion} className={className}>{suggestion}</li>
        })}
      </ul>
    )
  },
  render () {
    var suggestions = this.state.suggestions
    return (
      <div>
        <input type="text" placeholder={this.props.placeholder} ref="input" onChange={this.onChange} onKeyDown={this.onKeyDown} value={this.state.displayText} />
        {this.getSuggestionList()}
      </div>
    )
  }
})

export default AutoCompleteView
