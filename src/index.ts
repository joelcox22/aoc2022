import * as util from './util'

const problem = process.argv[2]
const { solve } = await import('./' + problem + '.ts')
await util.solve(problem, solve)
