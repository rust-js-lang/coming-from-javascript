// bun chapters/15-duck-typing-is-traits/compare.js: a broadcast with a
// misspelled notifier among the others.
import * as js from './js/notify.js'
import * as rust from './rust/src/lib.js'

const log = []
try {
  js.broadcast([js.email('ada@example.com'), js.pager('42'), js.sms('555-0100')], 'deploying', log)
} catch (error) {
  log.push(`then threw: ${error.message}`)
}
console.log(`js:   ${JSON.stringify(log, null, 1)}`)
console.log(`rust: a pager whose impl has no send() doesn't compile; the rest send:`)
console.log(`      ${JSON.stringify(rust.broadcast([{ address: 'ada@example.com' }], [{ number: '555-0100' }], 'deploying'))}`)
