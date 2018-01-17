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
    descriptionHtml: '<p>Desc</p>',
    locations: [
      {
        name: 'Sydney',
        isDeployed: true,
        coordinates: {
          lat: 33.8688,
          lon: 151.2093
        }
      },
      {
        name: 'Melborn',
        isDeployed: false,
        coordinates: {
          lat: 32.1563,
          lon: 151.3084
        }
      }
    ],
    nLastTotalTransactions: 8065,
    lastTotalTransactionsReportDate: new Date(1514879926554),
    transactionsRatePerSec: 2000
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    descriptionHtml: '<p><b>Desc</b></p>',
    locations: [
      {
        name: 'London',
        isDeployed: true,
        coordinates: {
          lat: 23.8688,
          lon: 141.2093
        }
      },
      {
        name: 'Manchester',
        isDeployed: true,
        coordinates: {
          lat: 22.1563,
          lon: 141.3084
        }
      },
      {
        name: 'Coventry',
        isDeployed: true,
        coordinates: {
          lat: 22.8563,
          lon: 140.3084
        }
      }
    ],
    nLastTotalTransactions: 15065,
    lastTotalTransactionsReportDate: new Date(1514879126554),
    transactionsRatePerSec: 1000
  }
}

run(SPA, {
  DOM: makeDOMDriver(document.body),
  data: () => xs.of(data),
  history: makeHistoryDriver()
})
