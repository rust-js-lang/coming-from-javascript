// bun chapters/05-strings-are-utf-8/compare.js: text with emoji, both ways.
import * as js from './js/text.js'
import * as rust from './rust/src/lib.js'

for (const text of ['héllo', '😀👍 ok']) {
  console.log(JSON.stringify(text))
  console.log(`  characters    js: ${String(js.charCount(text)).padEnd(14)} rust: ${rust.charCount(text)}`)
  console.log(`  bytes         js: ${String(js.byteSize(text)).padEnd(14)} rust: ${rust.byteSize(text)}`)
  console.log(`  truncate 3    js: ${JSON.stringify(js.truncate(text, 3)).padEnd(14)} rust: ${JSON.stringify(rust.truncate(text, 3))}`)
  console.log(`  reverse       js: ${JSON.stringify(js.reverse(text)).padEnd(14)} rust: ${JSON.stringify(rust.reverse(text))}`)
}
