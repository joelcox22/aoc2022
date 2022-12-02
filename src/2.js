import * as util from './util.js'

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

function whoWins ([p1, p2]) {
  let result
  if (p1 === 'rock') result = p2 === 'scissors' ? 'player1' : 'player2'
  if (p1 === 'paper') result = p2 === 'rock' ? 'player1' : 'player2'
  if (p1 === 'scissors') result = p2 === 'paper' ? 'player1' : 'player2'
  if (p1 === p2) result = 'draw'
  return [result, p2]
}

function calculateScore ([winner, choice]) {
  return values[choice] + (winner === 'player1' ? 0 : winner === 'player2' ? 6 : 3)
}

function choose (p1, target) {
  if (target === transform.Y) return p1
  if (target === transform.X) return p1 === 'paper' ? 'rock' : p1 === 'rock' ? 'scissors' : 'paper'
  return p1 === 'paper' ? 'scissors' : p1 === 'rock' ? 'paper' : 'rock'
}

util.solve((input) => {
  const data = input.trim().split('\n').map(line => line.split(' ').map(x => transform[x]))

  const winners = data.map(whoWins)
  const scores = winners.map(calculateScore)

  const plan = data.map(([p1, p2]) => [p1, choose(p1, p2)])
  const winners2 = plan.map(whoWins)
  const scores2 = winners2.map(calculateScore)

  return [Math.sum(scores), Math.sum(scores2)]
})
