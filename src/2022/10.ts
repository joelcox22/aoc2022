import { sum } from 'lodash'
import { produce } from 'immer'
import * as util from '../util'

export const expect = [13140]

interface State {
  register: number
  cycle: number
  measurements: number[]
  output: string
}

const step = (state: State, instruction: string): State => produce(state, (draft: State) => {
  const cycle = (): void => {
    const x = draft.cycle % 40
    if (x === 0) draft.output += '\n'
    draft.cycle++
    draft.output += (draft.register >= (x - 1) && draft.register <= (x + 1)) ? '#' : '.'
    if (draft.cycle === 20 || (draft.cycle > 40 && (draft.cycle - 20) % 40 === 0)) {
      draft.measurements.push(draft.cycle * draft.register)
    }
  }
  cycle()
  const [op, ...args] = instruction.split(' ')
  if (op === 'addx') {
    cycle()
    draft.register += parseInt(args[0], 10)
  }
})

export const solve: util.Solver = (input) => {
  const result = input.trim().split('\n').reduce(step, {
    register: 1,
    cycle: 0,
    measurements: [],
    output: ''
  })
  console.log(result.output)
  return [sum(result.measurements), 'see above']
}
