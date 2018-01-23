import { div } from '@cycle/dom'
import { Stream } from 'xstream'
import * as zingchart from 'zingchart'

interface Sources {
  deployedPercentage: Stream<number>
}

export default ({
  deployedPercentage: deployedPercentage$
}: Sources) => {
  const vnode$ = deployedPercentage$
    .map((deployedPercentage) => {
      const chartData = {
        type: 'bar',
        title: {
          text: 'Deployment Progress'
        },
        scaleY: {
          values: '0:100:10'
        },
        scaleX: {
          visible: false
        },
        series: [
          {
            values: [deployedPercentage],
            backgroundColor: '#F8B237',
            valueBox: {
              text: '%v%',
              placement: 'bottom-out'
            }
          }
        ]
      }

      return div({
        attrs: {
          id: 'deployed-chart'
        },
        hook: {
          insert: () => {
            console.log('creiiiate')
            zingchart.render({
              id: 'deployed-chart',
              data: chartData,
              height: 500,
              width: 725
            })
          }
        }
      })
    })

  return {
    DOM: vnode$
  }
}
