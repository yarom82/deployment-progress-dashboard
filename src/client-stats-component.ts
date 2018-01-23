import { ClientStats } from './interfaces'
import { div, h2, p } from '@cycle/dom'
import { PageComponent, StandardPageSinks } from '@cycle-components/pick-path-router'
import xs, { Stream } from 'xstream'
import DeployedChartComponent from './deployed-chart-component'
import TransactionsComponent from './transactions-component'
import LocationsComponent from './locations-component'

export interface SourcesSansParams {
  clientsStats: Stream<Record<string, ClientStats>>
}

interface Sources extends SourcesSansParams {
  params: string[]
}

const ClientStatsComponent: PageComponent<Sources, StandardPageSinks> = ({
  clientsStats: clientsStats$,
  params: [clientId]
}: Sources) => {
  const clientStats$ = clientsStats$.map(clientsStats => clientsStats[clientId])

  const deployedPercentage$ = clientStats$
    .map(({ locations }) => {
      const nLocations = locations.length
      const nDeployedLocations = locations.filter(l => l.isDeployed).length
      return nDeployedLocations / nLocations * 100
    })

  const { DOM: deployedChartVNode$ } = DeployedChartComponent({
    deployedPercentage: deployedPercentage$
  })

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
    .combine(clientStats$, deployedChartVNode$, transactionsVNode$, locationsVNode$)
    .map(([
      {
        name,
        descriptionHtml
      },
      deployedChartVNode,
      transactionsVNode,
      locationsVNode
    ]) => {
      return div([
        h2(name),
        div({ props: { innerHTML: descriptionHtml } }),
        deployedChartVNode,
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
