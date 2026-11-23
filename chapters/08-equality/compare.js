// bun chapters/08-equality/compare.js: equality of points, and order of versions.
import * as js from './js/equality.js'
import * as rust from './rust/src/lib.js'

const walk = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 0 }]
console.log(`samePoint({x:1,y:2}, {x:1,y:2})   js: ${js.samePoint({ x: 1, y: 2 }, { x: 1, y: 2 })}   rust: ${rust.samePoint({ x: 1, y: 2 }, { x: 1, y: 2 })}`)
console.log(`containsPoint(walk, {x:1,y:0})    js: ${js.containsPoint(walk, { x: 1, y: 0 })}   rust: ${rust.containsPoint(walk, { x: 1, y: 0 })}`)
console.log(`uniquePoints(walk).length          js: ${js.uniquePoints(walk).length}       rust: ${rust.uniquePoints(walk).length}`)
const versions = ['1.10.0', '1.2.0', '1.9.3']
console.log(`sort ${JSON.stringify(versions)}`)
console.log(`  js:   ${JSON.stringify(js.sortVersions(versions))}`)
console.log(`  rust: ${JSON.stringify(rust.sortVersions(versions))}`)
