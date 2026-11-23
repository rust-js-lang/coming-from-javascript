// bun chapters/09-string-flags-are-enums/compare.js: each order, both ways.
import cases from './cases.json'
import * as js from './js/orders.js'
import * as rust from './rust/src/lib.js'

for (const { order } of cases) {
  console.log(JSON.stringify(order))
  console.log(`  js:   ${js.describe(order)}`)
  console.log(`  rust: ${rust.describe(order)}`)
}
