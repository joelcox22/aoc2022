import * as util from '../util'

export const expect = [7, 336]

export const solve: util.Solver = (input) => {
  const lines = input.trim().split('\n')
  const deltas = [[1, 1], [3, 1], [5, 1], [7, 1], [1, 2]]
  const results = deltas.map(([dx, dy]) => {
    let count = 0
    for (let y = 0, i = 0; y < lines.length; y += dy, i++) {
      const x = (i * dx) % lines[y].length
      if (lines[y][x] === '#') count++
    }
    return count
  })
  console.log(results)
  return [results[1], results.reduce((a, b) => a * b, 1)]
}
