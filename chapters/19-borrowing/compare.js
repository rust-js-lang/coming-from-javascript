// bun chapters/19-borrowing/compare.js: removing done tasks, three ways.
import cases from './cases.json'
import * as js from './js/tasks.js'
import * as rust from './rust/src/lib.js'

const make = () => cases[0].tasks.map(([title, done]) => ({ title, done }))
const titles = (tasks) => JSON.stringify(tasks.map((t) => t.title))
const [spliced, backwards, retained] = [make(), make(), make()]
js.removeDoneWithSplice(spliced)
js.removeDone(backwards)
rust.removeDone(retained)
console.log(`remove the done tasks from ${JSON.stringify(cases[0].tasks)}`)
console.log(`  js, splice in forEach: ${titles(spliced)}`)
console.log(`  js, backwards:         ${titles(backwards)}`)
console.log(`  rust, retain:          ${titles(retained)}`)
