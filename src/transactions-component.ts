import xs, { Stream } from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'
import { div } from '@cycle/dom'

export interface Sources {
  nLastTotalTransactions: Stream<number>
  lastTotalTransactionsReportDate: Stream<Date>
  transactionsRatePerSec: Stream<number>
}

export default ({
  nLastTotalTransactions: nLastTotalTransactions$,
  lastTotalTransactionsReportDate: lastTotalTransactionsReportDate$,
  transactionsRatePerSec: transactionsRatePerSec$
}: Sources) => {
  const tick$ = xs.periodic(100)
  const vnode$ = tick$
    .compose(sampleCombine(nLastTotalTransactions$, lastTotalTransactionsReportDate$, transactionsRatePerSec$))
    .map(([_tick, nLastTotalTransactions, lastTotalTransactionsReportDate, transactionsRatePerSec]) => {
      const currentDate = new Date()
      const nSecondsFromLastReport = (currentDate.getTime() - lastTotalTransactionsReportDate.getTime()) / 1000
      const nTransactions = Math.round(nSecondsFromLastReport * transactionsRatePerSec + nLastTotalTransactions)
      return div(nTransactions)
    })

  return {
    DOM: vnode$
  }
}
