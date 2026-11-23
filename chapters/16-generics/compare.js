// bun chapters/16-generics/compare.js: largest, of what each side accepts.
import * as js from './js/generic.js'
import * as rust from './rust/src/lib.js'

console.log(`largest([3, 9, 4])                  js: ${js.largest([3, 9, 4])}   rust: ${rust.highestScore([3, 9, 4])}`)
console.log(`largest(["pear", "zucchini"])       js: ${js.largest(['pear', 'zucchini'])}   rust: ${rust.lastWord(['pear', 'zucchini'])}`)
console.log(`largest([{price: 3}, {price: 9}])   js: ${JSON.stringify(js.largest([{ price: 3 }, { price: 9 }]))}   rust: won't compile, a price has no >`)
console.log(`largest([2, "10"])                  js: ${JSON.stringify(js.largest([2, '10']))}   rust: won't compile, a Vec holds one type`)
