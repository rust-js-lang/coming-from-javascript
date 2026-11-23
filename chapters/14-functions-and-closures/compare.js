// bun chapters/14-functions-and-closures/compare.js: closures made in a loop.
import * as js from './js/closures.js'
import * as rust from './rust/src/lib.js'

console.log(`three adders made in a loop, each given 10`)
console.log(`  js, var: ${JSON.stringify(js.addersWithVar(3))}`)
console.log(`  js, let: ${JSON.stringify(js.adders(3))}`)
console.log(`  rust:    ${JSON.stringify(rust.adders(3))}`)
const next = rust.counter()
console.log(`a Rust counter, called from JavaScript: ${next()}, ${next()}, ${next()}`)
