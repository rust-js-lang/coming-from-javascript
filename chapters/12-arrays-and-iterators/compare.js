// bun chapters/12-arrays-and-iterators/compare.js: scores, both ways.
import * as js from './js/scores.js'
import * as rust from './rust/src/lib.js'

const forJs = [9, 100, 85, 10]
const forRust = [9, 100, 85, 10]
console.log(`topThree([9, 100, 85, 10])`)
console.log(`  js:   ${JSON.stringify(js.topThree(forJs))}, and the scores are now ${JSON.stringify(forJs)}`)
console.log(`  rust: ${JSON.stringify(rust.topThree(forRust))}, and the scores are still ${JSON.stringify(forRust)}`)
console.log(`highest([])        js: ${js.highest([])}   rust: ${rust.highest([])}`)
console.log(`scoreAt([70], 5)   js: ${js.scoreAt([70], 5)}   rust: ${rust.scoreAt([70], 5)}`)
