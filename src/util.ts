import * as fs from 'fs'
import * as path from 'path'
import { printTable } from 'console-table-printer'

export const sort = {
  ascending: (a: number, b: number) => b - a,
  descending: (a: number, b: number) => a - b
}

export const flags = {
  SKIP_REAL: false
}

export type Solver = (input: string) => number[]

export async function solve (problem: string, solver: Solver): Promise<void> {
  const start = performance.now()
  const inputs = ['example']
  if (!flags.SKIP_REAL) inputs.push('real')
  const results = await Promise.all(inputs.map(async (input) => {
    const inputPath = path.join('inputs', input, problem)
    let content: string
    if (fs.existsSync(inputPath)) {
      // read input from file if it exists
      content = fs.readFileSync(inputPath, 'utf-8')
    } else {
      // fetch it from the website directly if we don't have it yet
      // (saves me some time copy+pasting it manually 🤣)
      if (input === 'real') {
        if (fs.existsSync('cookie.txt')) {
          content = await (await fetch(`https://adventofcode.com/2022/day/${problem}/input`, {
            headers: {
              Cookie: fs.readFileSync('cookie.txt', 'utf-8')
            }
          })).text()
        } else {
          throw new Error('grab your cookie from the website, save it as `cookie.txt` in the repo root, then try again')
        }
      } else {
        const res = await fetch(`https://adventofcode.com/2022/day/${problem}`)
        const html = await res.text()
        const match = html.match(/<pre><code>(.*?)<\/code><\/pre>/s)
        if (match !== null) {
          content = match[1]
        } else {
          throw new Error('could not find example input')
        }
      }
      fs.mkdirSync(`inputs/${input}`, { recursive: true })
      fs.writeFileSync(inputPath, content)
    }
    let result = solver(content.trim())
    if (!Array.isArray(result)) {
      result = [result]
    }
    return result
  }))
  const end = performance.now()
  printTable([
    {
      Part: 1,
      Example: results[0][0],
      Solution: results[1][0]
    },
    {
      Part: 2,
      Example: results[0][1],
      Solution: results[1][1]
    }
  ])
  console.log((end - start).toFixed(2) + 'ms')
}

export interface TimelineData {
  owner_id: string
  event: string
  members: {
    [key: string]: {
      local_score: number
      global_score: number
      stars: number
      name: string
      last_star_ts: number
      id: number
      completion_day_level: {
        [key: string]: {
          '1': {
            get_star_ts: number
            star_index: number
          }
          '2': {
            get_star_ts: number
            star_index: number
          }
        }
      }
    }
  }
}

export async function fetchTimeline (): Promise<TimelineData> {
  if (fs.existsSync('timeline.json')) {
    return JSON.parse(fs.readFileSync('timeline.json', 'utf-8'))
  }
  const res = await fetch('https://adventofcode.com/2022/leaderboard/private/view/1932929.json', {
    headers: {
      Cookie: fs.readFileSync('cookie.txt', 'utf-8')
    }
  })
  const data = await res.json()
  fs.writeFileSync('timeline.json', JSON.stringify(data, null, 2))
  return data as TimelineData
}
