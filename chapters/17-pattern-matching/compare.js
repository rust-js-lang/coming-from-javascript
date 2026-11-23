// bun chapters/17-pattern-matching/compare.js: each path, both ways.
import cases from './cases.json'
import * as js from './js/router.js'
import * as rust from './rust/src/lib.js'

for (const { path } of cases) {
  console.log(`${path.padEnd(20)} js: ${js.title(path).padEnd(22)} rust: ${rust.title(path)}`)
}
