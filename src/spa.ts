import { DOMSource } from '@cycle/dom'
import { Location } from '@cycle/history'
import xs, { MemoryStream, Stream } from 'xstream'
import ClientStatsComponent, { SourcesSansParams } from './client-stats-component'
import { Data } from './interfaces'
import PickPathRouter, { Page, StandardPageSinks, Routes } from '@cycle-components/pick-path-router'

interface Sources {
  DOM: DOMSource
  data: Stream<Data>
  history: MemoryStream<Location>
}

export default ({ data: clientsStats$, history: history$ }: Sources) => {
  const periodicClientIdCycle$ = clientsStats$
    .map(clientsStats => xs
      .periodic(5000)
      .map(i => {
        const clientsStatsKeys = Object.keys(clientsStats)
        return clientsStatsKeys[i % clientsStatsKeys.length]
      })
    )
    .flatten()
  const navigation$ = periodicClientIdCycle$.map(id => '/client/' + id)
  type ClientStatsPage = Page<SourcesSansParams, StandardPageSinks>
  const clientStatsPage: ClientStatsPage = {
    Component: ClientStatsComponent,
    sources: { clientsStats: clientsStats$ }
  }

  const routes$: Stream<Routes<ClientStatsPage>> = xs.of({
    '/client/:id': clientStatsPage
  })

  const { match: match$ } = PickPathRouter({
    path: history$.map(location => location.pathname),
    routes: routes$
  })
  const pageSinks$ = match$.map(match => match.sinks)
  return {
    DOM: pageSinks$.map(pageSinks => pageSinks.DOM).flatten(),
    history: navigation$
  }
}
