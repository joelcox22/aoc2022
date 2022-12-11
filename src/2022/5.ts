import * as util from '../util'

export const expect = ['CMZ', 'MCD']

export const solve: util.Solver = (input) => {
  const data = input.split('\n\n')
  const stacks: string[][] = []
  data[0].split('\n').slice(0, -1).reverse().forEach((line) => {
    for (let i = 1; i < line.length; i += 4) {
      const stackIndex = (i - 1) / 4
      if (!(stackIndex in stacks)) stacks[stackIndex] = []
      if (line[i] !== ' ') {
        stacks[stackIndex].push(line[i])
      }
    }
  })
  const moves = data[1].trim().split('\n').map((instruction) => {
    const [, count, from, to] = instruction.match(/move (\d+) from (\d+) to (\d+)/)! // eslint-disable-line @typescript-eslint/no-non-null-assertion
    return { count: parseInt(count, 10), from: parseInt(from, 10) - 1, to: parseInt(to, 10) - 1 }
  })
  const stacks2: string[][] = JSON.parse(JSON.stringify(stacks))
  moves.forEach((move) => {
    for (let i = 0; i < move.count; i++) {
      stacks[move.to].push(stacks[move.from].pop()!) // eslint-disable-line @typescript-eslint/no-non-null-assertion
    }
    stacks2[move.to].push(...stacks2[move.from].splice(stacks2[move.from].length - move.count, move.count))
  })
  const message = stacks.map((stack) => stack[stack.length - 1]).join('')
  const message2 = stacks2.map((stack) => stack[stack.length - 1]).join('')
  return [message, message2]
}
