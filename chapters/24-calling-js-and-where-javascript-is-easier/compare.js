// bun chapters/24-calling-js-and-where-javascript-is-easier/compare.js:
// Rust's activity feed, worded by JavaScript's Intl.
import cases from './cases.json'
import * as rust from './rust/src/lib.js'

const events = cases.events.map(([who, did, at]) => ({ who, did, at }))
for (const line of rust.feed(events, 86400, (e) => e.who !== 'bot')) console.log(line)
console.log(`greet('Ada'): ${rust.greet('Ada')}`)
