// bun chapters/11-try-catch-is-result/compare.js: forms, both ways.
import cases from './cases.json'
import * as js from './js/signup.js'
import * as rust from './rust/src/lib.js'

for (const { form: [email, password, age] } of cases) {
  const form = { email, password, age }
  console.log(`${JSON.stringify(email)}, age ${JSON.stringify(age)}`)
  console.log(`  js:   ${js.message(form)}`)
  console.log(`  rust: ${rust.message(form)}`)
}
