import { Stream } from 'xstream'
import { ul, li, br } from '@cycle/dom'
import { Location } from './interfaces'

export interface Sources {
  locations: Stream<Array<Location>>
}

export default ({
  locations: locations$
}: Sources) => {
  const vnode$ = locations$
    .map((locations) => {
      return ul(
        locations.map(({name, isDeployed, coordinates: {lat, lon}}) => li(
          [
            name,
            br(),
            isDeployed ? 'Deployed' : 'Not Deployed',
            br(),
            lat.toString(),
            br(),
            lon.toString()
          ]
        )))
    })
  return {
    DOM: vnode$
  }
}
