import * as util from './util'

function find (input: string, l: number): number {
  for (let i = l; i < input.length; i++) {
    if (input.substring(i - l, i).split('').filter((v, i, a) => a.indexOf(v) === i).length === l) {
      return i
    }
  }
  throw new Error('Failed to find marker')
}

export const solve: util.Solver = (input) => {
  return [find(input, 4), find(input, 14)]
}
