import * as _ from 'lodash'
import * as chalk from 'chalk'
import * as util from '../util'

export const expect = [24, 93]

interface Point {
  x: number
  y: number
}

class Space {
  width: number
  height: number
  data: Record<string, string> = {}

  constructor (input: string, public part: 1 | 2) {
    const lines = input.trim().split('\n')
      .map((line) => line.split(' -> ')
        .map((point) => point.split(',').map(Number))
        .map(([x, y]) => ({ x, y }))) as Point[][]
    this.width = Math.max(...lines.flatMap((line) => line.map((point) => point.x)))
    this.height = Math.max(...lines.flatMap((line) => line.map((point) => point.y)))
    if (part === 2) {
      this.height += 2
      lines.push([{ x: 0, y: this.height }, { x: 1000, y: this.height }])
    }
    for (const line of lines) {
      for (let i = 0; i < line.length - 1; i++) {
        const from = line[i]
        const to = line[i + 1]
        const dx = _.clamp(to.x - from.x, -1, 1)
        const dy = _.clamp(to.y - from.y, -1, 1)
        let { x, y } = from
        do {
          this.set(x, y, '#')
          x += dx
          y += dy
          this.set(x, y, '#')
        } while (x !== to.x || y !== to.y)
      }
    }
  }

  get (x: number, y: number): string {
    return this.data[`${x},${y}`] ?? '.'
  }

  set (x: number, y: number, value: string): void {
    this.data[`${x},${y}`] = value
  }

  dropSand (): [Point | false, Point[]] {
    let x = 500
    let y = 0
    const path: Point[] = []
    do {
      path.push({ x, y })
      if (this.get(x, y + 1) === '.') {
        y++
      } else if (this.get(x - 1, y + 1) === '.') {
        x--
      } else if (this.get(x + 1, y + 1) === '.') {
        x++
        y++
      } else {
        break
      }
      if (y > this.height) {
        return [false, path]
      }
    } while (true)
    this.set(x, y, 'o')
    return [{ x, y }, path]
  }

  draw (path: Point[]): void {
    const pathSet = new Set(path.map((point) => `${point.x},${point.y}`))
    for (let y = 0; y <= this.height; y++) {
      let line = ''
      for (let x = 250; x <= 750; x++) {
        line += pathSet.has(`${x},${y}`) ? chalk.redBright(this.get(x, y)) : this.get(x, y)
      }
      console.log(line)
    }
  }

  fill (): number {
    let i = 0
    let path
    let point: Point | false
    do {
      const res = this.dropSand()
      point = res[0]
      path = res[1]
      if (point === false) break
      i++
      if (point.x === 500 && point.y === 0) break
    } while (true)
    this.draw(path)
    return i
  }
}

export const solve: util.Solver = (input) => {
  const part1 = new Space(input, 1)
  const part2 = new Space(input, 2)
  return [part1.fill(), part2.fill()]
}
