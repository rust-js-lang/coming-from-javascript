// bun chapters/23-testing/compare.js: each password, both ways.
import cases from './cases.json'
import * as js from './js/password.js'
import * as rust from './rust/src/lib.js'

for (const [password] of cases.passwords) {
  console.log(`${JSON.stringify(password).padEnd(22)} js: ${js.strength(password).padEnd(8)} rust: ${rust.strength(password)}`)
}
