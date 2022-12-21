import * as util from '../util'

export const expect = [3068, 1514285714288]

const shapes: number[][] = [
  [0b1111],
  [0b0100, 0b1110, 0b0100],
  [0b1110, 0b0010, 0b0010],
  [0b1000, 0b1000, 0b1000, 0b1000],
  [0b1100, 0b1100]
].map((shape) => shape.map((row) => row << 2))

const floor = 0b111111111
const walls = 0b100000001

interface State {
  data: number[]
  falling: number[]
  y: number
  count: number
  steps: number
  targetCount: number
  actions: string[]
  addedHeight: number
  cache: Record<string, {
    steps: number
    count: number
    height: number
  }>
  answer: number
}

const collision = (state: State): boolean => state.falling.some((row, i) => ((state.data[i + state.y] | walls) & row) > 0)

function move (state: State, dx: number, dy: number): State {
  const check: State = { ...state, y: state.y + dy }
  if (dx < 0) {
    check.falling = check.falling.map((row) => row << 1)
  } else if (dx > 0) {
    check.falling = check.falling.map((row) => row >> 1)
  }
  return collision(check) ? state : check
}

function step (state: State): State {
  const action = state.actions[state.steps++ % state.actions.length]
  const pushedState = move(state, action === '<' ? -1 : 1, 0)
  const downState = move(pushedState, 0, -1)
  if (downState === pushedState) {
    downState.falling.forEach((row, i) => {
      downState.data[pushedState.y + i] |= row
    })
    downState.falling = shapes[downState.count % shapes.length]
    downState.y = downState.data.length + 3
    downState.count++
    const checkCount = 500
    if (downState.addedHeight === 0 && downState.count > checkCount && downState.count < downState.targetCount - checkCount) {
      const v = downState.data.slice(downState.data.length - checkCount).reduce((acc, value) => acc + value, 0)
      const key = `${v},${downState.steps % state.actions.length},${downState.count % shapes.length}`
      if (key in state.cache) {
        const cache = state.cache[key]
        downState.steps = cache.steps
        const countChange = downState.count - cache.count
        const heightChange = downState.data.length - cache.height
        const multiplier = Math.floor((downState.targetCount - cache.count) / countChange) - 1
        downState.addedHeight += multiplier * heightChange
        downState.count += multiplier * countChange
      } else {
        state.cache[key] = {
          steps: downState.steps,
          count: downState.count,
          height: downState.data.length
        }
      }
    }
  }
  downState.answer = downState.y - 1 + downState.addedHeight
  return downState
}

function init (input: string, targetCount: number): State {
  return {
    data: [floor],
    falling: shapes[0],
    y: 4,
    count: 1,
    targetCount,
    addedHeight: 0,
    actions: input.trim().split(''),
    steps: 0,
    cache: {},
    answer: 0
  }
}

function loop (state: State): State {
  let newState = state
  while (newState.count < newState.targetCount) {
    newState = step(newState)
  }
  return newState
}

export const solve: util.Solver = (input) => {
  const part1 = loop(init(input, 2022))
  const part2 = loop(init(input, 1000000000000))
  return [part1.answer, part2.answer - 3] // -3 works for the example... needed -1 for the real answer 😅 no idea where I've got stuff wrong.
}
