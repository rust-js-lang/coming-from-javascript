// bun chapters/04-numbers/compare.js: where one kind of number and many disagree.
import * as js from './js/numbers.js'
import * as rust from './rust/src/lib.js'

const show = (value) => (typeof value === 'bigint' ? `${value}n` : JSON.stringify(value, (_, v) => (Number.isFinite(v) || typeof v !== 'number' ? v : String(v))))
console.log(`splitBill(1000, 3)          js: ${show(js.splitBill(1000, 3)).padEnd(22)} rust: ${show(rust.splitBill(1000, 3))}`)
console.log(`nextId(9007199254740992)    js: ${show(js.nextId(9007199254740992)).padEnd(22)} rust: ${show(rust.nextId(9007199254740992n))}`)
console.log(`addLives(250, 10)           js: ${show(js.addLives(250, 10)).padEnd(22)} rust: ${show(rust.addLives(250, 10))}`)
console.log(`percent(1, 0)               js: ${show(js.percent(1, 0)).padEnd(22)} rust: ${show(rust.percent(1, 0))}`)
let panicked
try {
  rust.splitBill(1000, 0)
} catch (error) {
  panicked = error.message
}
console.log(`splitBill(1000, 0)          js: ${show(js.splitBill(1000, 0)).padEnd(22)} rust: panics, ${panicked}`)
