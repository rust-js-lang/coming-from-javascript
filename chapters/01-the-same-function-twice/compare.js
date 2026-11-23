// bun chapters/01-the-same-function-twice/compare.js: each function on the
// same inputs, from the JavaScript and from the Rust, as rust-js compiled it.
import * as js from './js/basics.js'
import * as rust from './rust/src/lib.js'

for (const n of [3, 10, 15, 31]) {
  console.log(`fizzbuzz(${n})`.padEnd(30), `js: ${js.fizzbuzz(n).padEnd(10)} rust: ${rust.fizzbuzz(n)}`)
}
console.log(`total([0.1, 0.2])`.padEnd(30), `js: ${js.total([0.1, 0.2])}  rust: ${rust.total([0.1, 0.2])}`)
for (const name of ['ada lovelace', '😀 smile']) {
  console.log(`initials(${JSON.stringify(name)})`.padEnd(30), `js: ${JSON.stringify(js.initials(name)).padEnd(10)} rust: ${JSON.stringify(rust.initials(name))}`)
}
