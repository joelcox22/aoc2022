import _ from 'lodash'
import * as util from '../util'

export const expect = [15, 12]

type Input = 'A' | 'B' | 'C' | 'X' | 'Y' | 'Z'
type Option = 'rock' | 'paper' | 'scissors'
type Outcome = 'player1' | 'player2' | 'draw'

const transform = {
  A: 'rock',
  B: 'paper',
  C: 'scissors',
  X: 'rock',
  Y: 'paper',
  Z: 'scissors'
}

const values = {
  rock: 1,
  paper: 2,
  scissors: 3
}

function whoWins ([p1, p2]: Option[]): [Outcome, Option] {
  let result: Outcome = 'draw'
  if (p1 === p2) return [result, p2]
  if (p1 === 'rock') result = p2 === 'scissors' ? 'player1' : 'player2'
  else if (p1 === 'paper') result = p2 === 'rock' ? 'player1' : 'player2'
  else if (p1 === 'scissors') result = p2 === 'paper' ? 'player1' : 'player2'
  return [result, p2]
}

function calculateScore ([winner, choice]: [Outcome, Option]): number {
  return values[choice] + (winner === 'player1' ? 0 : winner === 'player2' ? 6 : 3)
}

function choose (p1: Option, target: Option): Option {
  if (target === transform.Y) return p1
  if (target === transform.X) return p1 === 'paper' ? 'rock' : p1 === 'rock' ? 'scissors' : 'paper'
  return p1 === 'paper' ? 'scissors' : p1 === 'rock' ? 'paper' : 'rock'
}

export const solve: util.Solver = (input) => {
  const data = input.trim().split('\n').map(line => line.split(' ').map(x => transform[x as Input])) as Option[][]

  const winners = data.map(whoWins)
  console.log(winners)
  const scores = winners.map(calculateScore)

  const plan = data.map(([p1, p2]) => [p1, choose(p1, p2)])
  const winners2 = plan.map(whoWins)
  const scores2 = winners2.map(calculateScore)

  console.log(scores)

  return [_.sum(scores), _.sum(scores2)]
}
