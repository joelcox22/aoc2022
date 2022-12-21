import * as fs from 'fs'
import * as path from 'path'
import * as chalk from 'chalk'

export const sort = {
  ascending: (a: number, b: number) => b - a,
  descending: (a: number, b: number) => a - b
}

export type Solver = (input: string, isExample) => Array<string | number>

export interface Solution {
  solve: Solver
  expect?: Array<string | number>
  skipReal?: boolean
}

export async function solve (year: string, problem: string, solution: Solution): Promise<number> {
  const start = performance.now()
  const inputs = ['example']
  const skip = solution.skipReal ?? false
  if (!skip) inputs.push('real')
  const results = await Promise.all(inputs.map(async (input) => {
    const inputPath = path.join('inputs', year, input, problem)
    let content: string
    if (fs.existsSync(inputPath)) {
      // read input from file if it exists
      content = fs.readFileSync(inputPath, 'utf-8')
    } else {
      // fetch it from the website directly if we don't have it yet
      // (saves me some time copy+pasting it manually 🤣)
      if (input === 'real') {
        if (fs.existsSync('cookie.txt')) {
          content = await (await fetch(`https://adventofcode.com/${year}/day/${problem}/input`, {
            headers: {
              Cookie: fs.readFileSync('cookie.txt', 'utf-8')
            }
          })).text()
        } else {
          throw new Error('grab your cookie from the website, save it as `cookie.txt` in the repo root, then try again')
        }
      } else {
        const res = await fetch(`https://adventofcode.com/${year}/day/${problem}`)
        const html = await res.text()
        const match = html.match(/<pre><code>(.*?)<\/code><\/pre>/s)
        if (match !== null) {
          content = match[1]
        } else {
          throw new Error('could not find example input')
        }
      }
      fs.mkdirSync(`inputs/${year}/${input}`, { recursive: true })
      fs.writeFileSync(inputPath, content)
    }
    let result = solution.solve(content, input === 'example')
    if (!Array.isArray(result)) {
      result = [result]
    }
    return result
  }))
  const end = performance.now()
  const color = (result: Array<string | number>, index: number): string => {
    if (solution.expect != null && typeof solution.expect[index] !== 'undefined') {
      return (solution.expect[index] === result[index])
        ? `${chalk.greenBright(result[index])} ${chalk.gray('correct')}`
        : `${chalk.redBright(result[index])} ${chalk.gray(`incorrect, expected ${solution.expect[index]}`)}`
    }
    return result[index].toString()
  }
  console.log('Part 1:')
  console.log('  Example:', color(results[0], 0))
  if (!skip) console.log('  Solution:', chalk.bold.yellowBright(results[1][0]))
  console.log('')
  if (results[0].length > 1) {
    console.log('Part 2:')
    console.log('  Example:', color(results[0], 1))
    if (!skip) console.log('  Solution:', chalk.bold.yellowBright(results[1][1]))
  }
  console.log('completed in', (end - start).toFixed(2), 'ms')
  if (results[0].length === 1 && solution.expect?.[0] === results[0][0]) {
    await submit(year, problem, 1, results[1][0])
  } else if (!skip) {
    if (results[0].length === 2 && solution.expect?.[1] === results[0][1]) {
      await submit(year, problem, 2, results[1][1])
    } else {
      console.log('Part 2 not implemented yet - return an extra number from your solve function.')
    }
  }
  const duration = (end - start)
  return duration
}

export async function submit (year: string, day: string, part: 1 | 2, answer: string | number): Promise<void> {
  if (getApproval(`Part ${part} solution looks like it might be correct. Do you want to submit it?`)) {
    const res = await fetch(`https://adventofcode.com/${year}/day/${day}/answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: fs.readFileSync('cookie.txt', 'utf-8')
      },
      body: `level=${part}&answer=${encodeURIComponent(answer)}`
    })
    const html = await res.text()
    const response = html.match(/<main>(.*?)<\/main>/s)?.[1]! // eslint-disable-line
    console.log(dehtml(response))
  } else {
    console.log('not submitting answer')
  }
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

export function getChar (): string {
  const buffer = Buffer.alloc(1)
  fs.readSync(0, buffer, 0, 1, null)
  return buffer.toString('utf-8')
}

export function getApproval (message: string): boolean {
  console.log(message, 'y/n')
  return getChar() === 'y'
}

export function dehtml (html: string): string {
  const text = html.replace(/<[^>]*>/g, '')
  return text
}

export const prompt = (question: string): string => {
  fs.writeFileSync('/dev/stdout', question)
  let input: string = ''
  do {
    input += getChar()
  } while (!input.includes('\n'))
  return input.trim()
}
