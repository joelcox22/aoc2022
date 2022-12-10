import { clamp } from 'lodash'
import { produce, enableMapSet } from 'immer'
import * as util from './util'

enableMapSet()

interface Point {
  x: number
  y: number
}

interface State {
  head: Point
  tails: Point[]
  tailsVisited: Array<Set<string>>
}

const moves: { [key: string]: number[] } = {
  L: [-1, 0],
  R: [1, 0],
  U: [0, -1],
  D: [0, 1]
}

function catchUp (head: Point, tail: Point): Point {
  const dx = head.x - tail.x
  const dy = head.y - tail.y
  if (Math.max(Math.abs(dx), Math.abs(dy)) <= 1) return tail
  return {
    x: tail.x + clamp(dx, -1, 1),
    y: tail.y + clamp(dy, -1, 1)
  }
}

const step = (state: State, step: string): State => produce(state, (draft: State) => {
  const [dx, dy] = moves[step]
  draft.head.x += dx
  draft.head.y += dy
  for (let i = 0; i < draft.tails.length; i++) {
    draft.tails[i] = catchUp(i === 0 ? draft.head : draft.tails[i - 1], draft.tails[i])
    draft.tailsVisited[i].add(`${draft.tails[i].x},${draft.tails[i].y}`)
  }
})

const init = (tails: number): State => ({
  head: { x: 0, y: 0 },
  tails: new Array(tails).fill({ x: 0, y: 0 }),
  tailsVisited: new Array(tails).fill(new Set())
})

export const solve: util.Solver = (input) => {
  const steps = input.trim().split('\n').flatMap((step) => {
    const [dir, count] = step.split(' ')
    return new Array(parseInt(count, 10)).fill(dir)
  })
  const result: State = steps.reduce<State>(step, init(9))
  return [result.tailsVisited[0].size, result.tailsVisited[result.tailsVisited.length - 1].size]
}
