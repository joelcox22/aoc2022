import * as util from './util.js'
import _ from 'lodash'

util.solve((input) => {
  const data = input.split('\n\n').map((food) => food.split('\n').map((cals) => cals - 0))
  const totals = data.map(_.sum).sort(util.sort.ascending)
  return [totals[0], _.sum(totals.slice(0, 3))]
})
