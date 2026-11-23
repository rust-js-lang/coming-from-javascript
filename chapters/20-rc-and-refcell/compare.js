// bun chapters/20-rc-and-refcell/compare.js: a shared cart, and a read
// while writing that only Rust refuses.
import * as js from './js/shop.js'
import * as rust from './rust/src/lib.js'

console.log(`shop(["tea", "cake"])   js: ${JSON.stringify(js.shop(['tea', 'cake']))}   rust: ${JSON.stringify(rust.shop(['tea', 'cake']))}`)
console.log(`read while adding`)
console.log(`  js:   ${js.readWhileAdding()}`)
try {
  rust.readWhileAdding()
} catch (error) {
  console.log(`  rust: panicked: ${error.message}`)
}
