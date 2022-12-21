import * as util from '../util'

export const expect = [2, 1]

export const solve: util.Solver = (input) => {
  const lines = input.trim().split('\n').map((line) => {
    const [, min, max, char, password] = line.match(/(\d+)-(\d+) ([^:]+): (.+)$/)! // eslint-disable-line
    return { min: parseInt(min), max: parseInt(max), char, password }
  })
  const part1 = lines.filter(({ min, max, char, password }) => {
    const matching = password.split('').filter((c) => c === char).length
    return matching >= min && matching <= max
  })
  const part2 = lines.filter(({ min: a, max: b, char, password }) => {
    console.log(password, a - 1, password[a - 1], b - 1, password[b - 1], char, password[a - 1] === char, password[b - 1] === char)
    return [password[a - 1] === char, password[b - 1] === char].filter(Boolean).length === 1
  })
  return [part1.length, part2.length]
}
