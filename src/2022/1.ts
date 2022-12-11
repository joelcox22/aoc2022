import _ from 'lodash'
import * as util from '../util'

export const expect = [24000, 45000]

export const solve: util.Solver = (input) => {
  const data = input.trim().split('\n\n').map((food) => food.split('\n').map((cals) => parseInt(cals, 10)))
  const totals = data.map(_.sum).sort(util.sort.ascending)
  return [totals[0], _.sum(totals.slice(0, 3))]
}
