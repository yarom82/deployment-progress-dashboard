import { ClientStats } from './interfaces'
import { div, h2, svg, h, p } from '@cycle/dom'
import { PageComponent, StandardPageSinks } from '@cycle-components/pick-path-router'
import xs, { Stream } from 'xstream'
import TransactionsComponent from './transactions-component'
import LocationsComponent from './locations-component'

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

  const nLastTotalTransactions$ = clientStats$.map(({ nLastTotalTransactions }) => nLastTotalTransactions)
  const lastTotalTransactionsReportDate$ = clientStats$.map(({ lastTotalTransactionsReportDate }) => lastTotalTransactionsReportDate)
  const transactionsRatePerSec$ = clientStats$.map(({ transactionsRatePerSec }) => transactionsRatePerSec)

  const { DOM: transactionsVNode$ } = TransactionsComponent({
    nLastTotalTransactions: nLastTotalTransactions$,
    lastTotalTransactionsReportDate: lastTotalTransactionsReportDate$,
    transactionsRatePerSec: transactionsRatePerSec$
  })

  const locations$ = clientStats$.map(({ locations }) => locations)

  const { DOM: locationsVNode$ } = LocationsComponent({
    locations: locations$
  })

  const vnode$ = xs
    .combine(clientStats$, transactionsVNode$, locationsVNode$)
    .map(([
      {
        name,
        descriptionHtml,
        locations
      },
      transactionsVNode,
      locationsVNode
    ]) => {
      const nLocations = locations.length
      const nDeployedLocations = locations.filter(l => l.isDeployed).length

      return div([
        h2(name),
        div({ props: { innerHTML: descriptionHtml } }),
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
        ]),
        p(['Transactions: ', transactionsVNode]),
        locationsVNode
      ])
    })

  return {
    title: xs.of(''),
    breadcrumbs: xs.of([]),
    DOM: vnode$
  }
}

export default ClientStatsComponent
