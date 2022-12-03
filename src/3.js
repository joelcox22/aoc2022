import * as util from './util.js'
import _ from 'lodash'

function itemPriority (item) {
  const value = item.charCodeAt(0)
  return value > 90 ? value - 96 : (value - 65 + 27)
}

const uniqueItem = (set) => _.intersection(...set.map((items) => items.split('')))[0][0]

util.solve((input) => {
  const chunks = input.split('\n').map((line) => [line.substr(0, line.length / 2), line.substr(line.length / 2)])
  const common = chunks.map(uniqueItem)
  const values = common.map(itemPriority)

  const chunks2 = _.chunk(input.split('\n'), 3)
  const common2 = chunks2.map(uniqueItem)
  const values2 = common2.map(itemPriority)

  return [_.sum(values), _.sum(values2)]
})
