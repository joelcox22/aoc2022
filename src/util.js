import * as fs from 'fs'
import * as path from 'path'

export const sort = {
  ascending: (a, b) => b - a,
  descending: (a, b) => a - b
}

export async function solve (solver, attemptReal = true) {
  const start = performance.now()
  const problem = process.argv[1].match(/(\d+)\.js/)[1]
  const inputs = ['example']
  if (attemptReal) inputs.push('real')
  const results = await Promise.all(inputs.map(async (input) => {
    const inputPath = path.join('inputs', input, problem)
    let content
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
        content = (await (await fetch(`https://adventofcode.com/2022/day/${problem}`)).text()).match(/<pre><code>(.*?)<\/code><\/pre>/s)[1]
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
  console.table({
    'Part 1': {
      Example: results[0][0],
      Solution: results[1]?.[0]
    },
    'Part 2': {
      Example: results[0][1],
      Solution: results[1]?.[1]
    }
  })
  console.log((end - start).toFixed(2) + 'ms')
}
