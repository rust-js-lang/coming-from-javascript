// bun chapters/18-moves/compare.js: a match's players, changed after it started.
import * as js from './js/match.js'

const players = ['ann', 'bo', 'cy', 'di', 'ed']
const match = js.startMatch(players)
players.push('sub')
console.log(`startMatch(players), then players.push('sub')`)
console.log(`  js:   ${js.lineUp(match)}`)
console.log(`  rust: won't compile: borrow of moved value: players`)
