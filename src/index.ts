import { makeDOMDriver } from '@cycle/dom'
import run from '@cycle/run'
import { makeHistoryDriver } from '@cycle/history'
import { Data } from './interfaces'
import SPA from './spa'
import xs from 'xstream'

const data: Data = {
  google: {
    id: 'google',
    name: 'Google',
    nLocations: 250,
    nDeployedLocations: 250
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    nLocations: 471,
    nDeployedLocations: 388
  }
}

run(SPA, {
  DOM: makeDOMDriver(document.body),
  data: () => xs.of(data),
  history: makeHistoryDriver()
})
