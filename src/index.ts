import * as path from 'path'
import * as util from './util'
import * as fs from 'fs'

const match = (process.argv[2] ?? '').match(/^((\d{4})\/)?(\d{1,2})$/)
const today = new Date()
const year = match?.[2] ?? today.getFullYear().toString()
const day = match?.[3] ?? today.getDate().toString()

if ((match == null) && today.getMonth() !== 11) {
  throw new Error('Unable to guess what year/day you want to run. Specify an argument like "2022/1" or "2022/12" or "2020/15", etc.')
}

const file = path.join(import.meta.dir, year, `${day}.ts`)

if (!fs.existsSync(file)) {
  fs.mkdirSync(path.join(import.meta.dir, year), { recursive: true })
  fs.copyFileSync(path.join(import.meta.dir, 'template.ts'), file)
}

const solver = await import(path.join(import.meta.dir, year, `${day}.ts`))
console.log(`AOC ${year} Day ${day}`)
await util.solve(year, day, solver)
