// bun chapters/22-async/compare.js: greetings, with and without await.
import * as js from './js/users.js'
import * as rust from './rust/src/lib.js'

for (const id of [1, 9]) {
  console.log(`greeting(${id})          js: ${(await js.greeting(id)).padEnd(18)} rust: ${await rust.greeting(id)}`)
}
console.log(`await forgotten, user 1   js: ${js.greetingForgotten(1).padEnd(18)} rust: won't compile, a future has no field name`)
