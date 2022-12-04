import _ from 'lodash'
import * as util from './util'

export const solve: util.Solver = (input) => {
  const data = input.split('\n\n').map((food) => food.split('\n').map((cals) => parseInt(cals, 10)))
  const totals = data.map(_.sum).sort(util.sort.ascending)
  return [totals[0], _.sum(totals.slice(0, 3))]
}
