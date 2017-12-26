import { ClientStats } from './interfaces'
import { div, h2, svg, h } from '@cycle/dom'
import { PageComponent, StandardPageSinks } from '@cycle-components/pick-path-router'
import xs, { Stream } from 'xstream'

export interface SourcesSansParams {
  clientsStats: Stream<Record<string, ClientStats>>
}

interface Sources extends SourcesSansParams {
  params: string[]
}

const commonTextAttrs = { y: '20', stroke: 'none', fill: 'white' }

const ClientStatsComponent: PageComponent<Sources, StandardPageSinks> = ({
  clientsStats: clientsStats$,
  params: [clientId]
}: Sources) => {
  const clientStats$ = clientsStats$.map(clientsStats => clientsStats[clientId])

  const vnode$ = clientStats$.map(({ name, nLocations, nDeployedLocations }) => div([
    h2(name),
    svg({
      attrs: { width: '200', height: '30' }
    }, [
      h('rect', {
        attrs: { width: '200', height: '30', fill: 'gray' }
      }),
      h('rect', {
        attrs: { width: String(200 * nDeployedLocations / nLocations), height: '30', fill: 'blue' }
      }),
      h('text', {
        attrs: { x: '10', ...commonTextAttrs }
      }, '0'),
      h('text', {
        attrs: { x: '90', ...commonTextAttrs }
      }, String(nDeployedLocations)),
      h('text', {
        attrs: { x: '160', ...commonTextAttrs }
      }, String(nLocations))
    ])
  ]))

  return {
    title: xs.of(''),
    breadcrumbs: xs.of([]),
    DOM: vnode$
  }
}

export default ClientStatsComponent
