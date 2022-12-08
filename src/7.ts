import { produce } from 'immer'
import * as util from './util'

interface State {
  cwd: string
  sizes: { [key: string]: number }
}

interface Step {
  command: string
  output: string[]
}

const exec = (state: State, step: Step): State => produce(state, (draft) => {
  const [command, ...args] = step.command.split(' ')
  switch (command) {
    case 'cd':
      if (args[0] === '..') {
        draft.cwd = draft.cwd.replace(/\/[^/]+\/$/, '')
      } else if (args[0].startsWith('/')) {
        draft.cwd = args[0]
      } else {
        draft.cwd += `/${args[0]}`
      }
      draft.cwd += '/'
      draft.cwd = draft.cwd.replace(/\/+/g, '/')
      if (!(draft.cwd in draft.sizes)) {
        draft.sizes[draft.cwd] = 0
      }
      break
    case 'ls':
      for (const line of step.output) {
        const match = line.match(/^(\d+)/)
        if (match !== null) {
          for (const dir of Object.keys(draft.sizes)) {
            if (draft.cwd.startsWith(dir)) {
              draft.sizes[dir] += parseInt(match[1], 10)
            }
          }
        }
      }
      break
  }
})

export const solve: util.Solver = (input) => {
  const commands: Step[] = input.split('\n$ ').map((command) => command.replace(/\$ /g, '')).map((chunk) => {
    const [command, ...output] = chunk.split('\n')
    return { command, output }
  })
  const state = commands.reduce(exec, { cwd: '', sizes: {} })
  const importantDirs = Object.entries(state.sizes).filter(([dir, size]) => size <= 100000)
  const totalSize = importantDirs.reduce((acc, [dir, size]) => acc + size, 0)
  const sorted = Object.entries(state.sizes).sort((a, b) => a[1] - b[1]).filter(([, size]) => 70000000 - state.sizes['/'] + size >= 30000000)
  return [totalSize, sorted[0][1]]
}
