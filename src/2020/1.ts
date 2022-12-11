import * as util from '../util'

export const expect = [514579, 241861950]

export const solve: util.Solver = (input) => {
  const lines = input.trim().split('\n').map((v) => parseInt(v, 10))
  const result: Array<string | number> = ['todo', 'todo']
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines.length; j++) {
      if (i === j) continue
      if (lines[i] + lines[j] === 2020) {
        result[0] = lines[i] * lines[j]
      }
      for (let k = 0; k < lines.length; k++) {
        if (i === k || j === k) continue
        if (lines[i] + lines[j] + lines[k] === 2020) {
          result[1] = lines[i] * lines[j] * lines[k]
        }
      }
    }
  }
  return result
}
