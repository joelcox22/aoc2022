import * as util from './util.js'

util.solve((input) => {
  const data = input.split('\n\n').map((food) => food.split('\n').map((cals) => cals - 0))
  const totals = data.map(Math.sum).sort(util.sort.ascending)
  return [totals[0], Math.sum(totals.slice(0, 3))]
})
