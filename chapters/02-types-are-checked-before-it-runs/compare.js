// bun chapters/02-types-are-checked-before-it-runs/compare.js: the cart,
// in JavaScript and in Rust (as rust-js compiled it).
import * as js from './js/cart.js'
import * as rust from './rust/src/lib.js'

const ada = { name: 'Ada', age: 36 }
console.log(`greet(ada)               js: ${js.greet(ada).padEnd(20)} rust: ${rust.greet(ada)}`)
console.log(`greetMistyped(ada)       js: ${js.greetMistyped(ada).padEnd(20)} rust: won't compile, no field nmae`)
console.log(`nextQuantity(2)          js: ${String(js.nextQuantity(2)).padEnd(20)} rust: ${rust.nextQuantity(2)}`)
console.log(`nextQuantity('2')        js: ${JSON.stringify(js.nextQuantity('2')).padEnd(20)} rust: won't compile, a &str isn't a u32`)
for (const text of ['7', '2.5', '12abc']) {
  console.log(`parseQuantity(${JSON.stringify(text)})`.padEnd(25), `js: ${String(js.parseQuantity(text)).padEnd(20)} rust: ${rust.parseQuantity(text)}`)
}
