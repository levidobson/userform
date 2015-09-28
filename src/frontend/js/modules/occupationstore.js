import {EventEmitter} from 'events'
import {assign} from '../../../../node_modules/lodash'
import AppDispatcher from './dispatcher'
import request from '../../../../node_modules/superagent'
import Rx from '../../../../node_modules/rx'

let eventEmitter = new EventEmitter()

let createObservableFromEmitter = type => {
  return Rx.Observable.fromEventPattern(
    h => {eventEmitter.addListener(type, h)},
    h => {eventEmitter.removeListener(type, h)},
    val => val
  )
}

var getJSON = url => {
  return Rx.Observable.create(observer => {
    console.log('GETJSON')
    request
      .get(url)
      .end((err, res) => {
        if (err) {
          return observer.onError(err)
        }
        observer.onNext(res.body)
        observer.onCompleted()
      })

    return Rx.Disposable.create()
  })
}

let changes = createObservableFromEmitter('change')

let suggestions = changes
  .debounce(250)
  .filter(text => text.length > 0)
  .flatMap(text => getJSON('/occupations?filter=' + text).retry(3).takeUntil(changes).map(body => body.occupations))

suggestions.forEach(
  occupations => {
    OccupationStore.emit('suggestions', occupations)
  },
  err => {
    OccupationStore.emit('suggestionError')
  }
)

var OccupationStore = assign({}, EventEmitter.prototype, {})

OccupationStore.dispatchToken = AppDispatcher.register((payload) => {
  switch (payload.action) {
    case 'autocomplete_change':
      eventEmitter.emit('change', payload.options)
      break
    default:
  }
})

export default OccupationStore
