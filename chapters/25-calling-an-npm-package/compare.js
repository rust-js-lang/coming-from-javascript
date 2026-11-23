// bun chapters/25-calling-an-npm-package/compare.js: Rust's calls of the
// `till` package, beside the same calls written in JavaScript.
import * as js from './js/checkout.js'
import * as rust from './rust/src/lib.js'

const items = [
  { name: 'tea', cents: 350, qty: 2 },
  { name: 'cake', cents: 425 },
]
const calls = [
  ['monies(1999)', (m) => m.monies(1999)],
  ['prices(1999)', (m) => m.prices(1999)],
  ['rounded(1999)', (m) => m.rounded(1999)],
  ['discounts(1999)', (m) => m.discounts(1999)],
  ['lines(...)', (m) => m.lines('the corner shop', ['tea', 'cake', 'paid'])],
  ['labels("tea")', (m) => m.labels('tea')],
  ['taxes(1000)', (m) => m.taxes(1000)],
  ['coupons(1999)', (m) => m.coupons(1999)],
  ['orderTotal("ada")', (m) => m.orderTotal('ada')],
  ['described()', (m) => m.described()],
  ['ringUp(items)', (m) => m.ringUp(items)],
]
for (const [name, call] of calls) {
  const [r, j] = [JSON.stringify(call(rust)), JSON.stringify(call(js))]
  console.log(`${r === j ? 'same' : 'DIFF'}  ${name.padEnd(18)} ${r}${r === j ? '' : `  js: ${j}`}`)
}
