import _ from 'lodash'
import * as util from '../util'

export const expect = [21, 8]

export const solve: util.Solver = (input) => {
  const data = input.trim().split('\n').map((line) => line.split('').map((i) => parseInt(i, 10)))
  const w = data[0].length
  const h = data.length
  let count = 0
  let maxScore = 0
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const visible =
        (x === 0 || x === w - 1 || y === 0 || y === h - 1) || // edges
        _.range(0, y).every((i) => data[i][x] < data[y][x]) || // up
        _.range(0, x).every((i) => data[y][i] < data[y][x]) || // left
        _.range(x + 1, w).every((i) => data[y][i] < data[y][x]) || // right
        _.range(y + 1, h).every((i) => data[i][x] < data[y][x]) // down
      if (visible) count++
      const deltas = [[0, -1], [-1, 0], [0, 1], [1, 0]] // up, left, right, down
      const distances = deltas.map(([dy, dx]) => {
        let score = 0
        let xx = x
        let yy = y
        do {
          score++
          xx += dx
          yy += dy
        } while (xx > 0 && xx < w - 1 && yy > 0 && yy < h - 1 && data[yy][xx] < data[y][x])
        return score
      })
      const score = distances.reduce((acc, value) => acc * value, 1)
      maxScore = Math.max(maxScore, score)
    }
  }
  return [count, maxScore]
}
