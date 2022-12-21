import * as util from '../util'
import { parse } from 'yaml'

export const expect = [10605, 2713310158]

interface Monkey {
  items: bigint[]
  operation: string
  test: bigint
  ifTrue: string
  ifFalse: string
  inspected: number
}

interface Monkeys { [key: string]: Monkey }

function parseInput (input: string): Monkeys {
  const monkeys: Monkeys = parse(input.toLowerCase()
    .replace(/starting items/g, 'items')
    .replace(/monkey (\d+)/g, 'monkey$1')
    .replace(/ {2}if true/g, 'ifTrue')
    .replace(/ {2}if false/g, 'ifFalse')
    .replace(/divisible by /g, '')
    .replace(/new =/g, '')
    .replace(/throw to/g, ''))
  for (const [, monkey] of Object.entries(monkeys)) {
    monkey.items = monkey.items.toString().split(', ').map(BigInt)
    monkey.test = BigInt(monkey.test)
    monkey.inspected = 0
  }
  return monkeys
}

function throwStuff (rounds: number, monkeys: Monkeys, thing: (bigint) => bigint): number {
  for (let round = 0; round < rounds; round++) {
    for (const [, monkey] of Object.entries(monkeys)) {
      while (monkey.items.length > 0) {
        let item = monkey.items.pop() as bigint
        item = BigInt(eval(`let old=${item.toString()}; ${monkey.operation};`)) // eslint-disable-line no-eval
        item = BigInt(thing(item))
        monkey.inspected++
        const target = monkeys[item % BigInt(monkey.test) === 0n ? monkey.ifTrue : monkey.ifFalse]
        target.items.push(item)
      }
    }
  }
  const mostActive = Object.values(monkeys).sort((a, b) => b.inspected - a.inspected)
  return mostActive[0].inspected * mostActive[1].inspected
}

export const solve: util.Solver = (input) => {
  const monkeys1 = parseInput(input)
  const monkeys2 = parseInput(input)

  const product = Object.values(monkeys2).reduce((acc, monkey) => acc * monkey.test, 1n)

  return [
    throwStuff(20, monkeys1, (item) => item / 3n),
    throwStuff(10000, monkeys2, (item) => item % product)
  ]
}
