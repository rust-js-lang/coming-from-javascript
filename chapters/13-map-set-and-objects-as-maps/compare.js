// bun chapters/13-map-set-and-objects-as-maps/compare.js: counting words three ways.
import * as js from './js/words.js'
import * as rust from './rust/src/lib.js'

const text = 'The constructor of the toString'
console.log(`counting ${JSON.stringify(text)}`)
console.log(`  js, a plain object: ${JSON.stringify(js.wordCountsObject(text))}`)
console.log(`  js, a Map:          ${JSON.stringify(js.sortedCounts(text))}`)
console.log(`  rust, a HashMap:    ${JSON.stringify(rust.sortedCounts(text))}`)
