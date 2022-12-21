import * as util from '../util'

export const expect = [152, 301]

export const solve: util.Solver = (input) => {
  const monkeys = input.trim().split('\n').reduce((acc, monkey) => {
    const [name, expression] = monkey.split(': ')
    if (expression.match(/\d+/) != null) {
      acc[name] = expression
    } else {
      acc[name] = expression.split(/^(.*) ([+-/*]) (.*)$/).splice(1, 3)
    }
    return acc
  }, {} as any) // eslint-disable-line

  function calc (monkey: string): string {
    if (typeof monkeys[monkey] === 'string') {
      return monkeys[monkey].toString()
    } else {
      return `(${calc(monkeys[monkey][0])}${monkeys[monkey][1]}${calc(monkeys[monkey][2])})` // eslint-disable-line
    }
  }

  const part1 = calc('root')

  monkeys.humn = 'humn'
  let left = calc(monkeys.root[0])
  let right = calc(monkeys.root[2])

  if (!left.includes('humn')) [right, left] = [left, right]

  const rightAnswer = eval(right) // eslint-disable-line

  let humn = 1
  let leftAnswer
  do {
    leftAnswer = eval(`let humn=${humn}; ${left}`) // eslint-disable-line
    const diff = Math.abs(leftAnswer - rightAnswer)
    humn += Math.max(Math.floor(diff * 0.1), 1)
    // console.log('guessed', humn, 'left is', leftAnswer, 'right is', rightAnswer)
  } while (leftAnswer !== rightAnswer)

  return [eval(part1), humn - 1] // eslint-disable-line
}
