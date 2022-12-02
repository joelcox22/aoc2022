import * as fs from 'fs'
import * as path from 'path'

Math.sum = (values) => values.reduce((a, b) => a + b, 0) // why isn't Math.sum a standard thing in JS Math lib? :(

export const sort = {
  ascending: (a, b) => b - a,
  descending: (a, b) => a - b
}

export function solve (solver, attemptReal = true) {
  const problem = process.argv[1].match(/(\d+)\.js/)[1]
  const inputs = ['example']
  if (attemptReal) inputs.push('real')
  const results = inputs.map((input) => {
    const inputPath = path.join('inputs', input, problem)
    let result
    if (fs.existsSync(inputPath)) {
      result = solver(fs.readFileSync(inputPath, 'utf8'))
    }
    if (!Array.isArray(result)) {
      result = [result]
    }
    return result
  })
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
}
