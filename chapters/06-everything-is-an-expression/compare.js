// bun chapters/06-everything-is-an-expression/compare.js: the days, both ways.
import * as js from './js/expressions.js'
import * as rust from './rust/src/lib.js'

for (const day of ['sat', 'fri', 'wed', 'holiday']) {
  console.log(`dayKind(${JSON.stringify(day)})`.padEnd(22), `js: ${js.dayKind(day).padEnd(15)} rust: ${rust.dayKind(day)}`)
}
console.log(`shipping(1999)`.padEnd(22), `js: ${String(js.shipping(1999)).padEnd(15)} rust: ${rust.shipping(1999)}`)
console.log(`stepsToOne(27)`.padEnd(22), `js: ${String(js.stepsToOne(27)).padEnd(15)} rust: ${rust.stepsToOne(27n)}`)
