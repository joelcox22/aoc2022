import * as fs from 'fs'
import * as util from './util'
import { format } from 'date-fns'

const data = await util.fetchTimeline()

const days: string[] = []
for (let i = 1; i <= 25; i++) {
  days.push(i.toString())
}

fs.writeFileSync('timeline.md', `
# Advent of Code ${data.event}

${days.map(day => `
\`\`\`mermaid
gantt
title Day ${day}
dateFormat  YYYY-MM-DD HH:mm:ss
axisFormat %H:%M
${Object.values(data.members)
  .filter((member) => '1' in (member.completion_day_level[day] ?? {}))
    .sort((a, b) => a.completion_day_level[day]?.['1']?.get_star_ts - b.completion_day_level[day]?.['1']?.get_star_ts)
    .map(member => {
      const getStarDate = (star: string): Date | null => {
        if (star in (member.completion_day_level[day] ?? {})) {
          return new Date(member.completion_day_level[day][star].get_star_ts * 1000)
        }
        return null
      }
      const start = getStarDate('1')
      const end = getStarDate('2')
      const section = [`section ${member.name ?? `Anonymous ${member.id}`}`]
       if ((start != null) && (end != null)) {
        section.push(`${format(start, 'h.mma')} - ${format(end, 'h.mma')} :${format(start, 'yyyy-MM-dd HH:mm:ss')}, ${format(end, 'yyyy-MM-dd HH:mm:ss')}`)
       } else if (start != null) {
        section.push(`${format(start, 'h.mma')} :milestone, ${format(start, 'yyyy-MM-dd HH:mm:ss')}`)
       }
      return section.join('\n')
    }).join('\n')}
\`\`\`
`).filter((chart) => chart.includes('section')).join('\n')}
`.trim())
