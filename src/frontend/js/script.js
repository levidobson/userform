import React from '../../../node_modules/react'
import MainView from './views/main.jsx'

;(() => {
  window.onload = () => {
    React.render(
      React.createElement(MainView),
        document.getElementById('userform-app')
    )
  }
})()
