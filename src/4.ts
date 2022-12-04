import * as util from './util'

export const solve: util.Solver = (input) => {
  const data = input.split('\n').map((pair) => pair.split(',').map((range) => range.split('-').map((v) => parseInt(v, 10)).sort((a, b) => a - b)))
  const count = data.filter(([a, b]) => (a[0] <= b[0] && a[1] >= b[1]) || (b[0] <= a[0] && b[1] >= a[1])).length
  const count2 = data.filter(([a, b]) => a[1] >= b[0] && b[1] >= a[0]).length
  return [count, count2]
}
