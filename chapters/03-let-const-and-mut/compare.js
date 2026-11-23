// bun chapters/03-let-const-and-mut/compare.js: a `const` object, changed.
import * as js from './js/settings.js'
import * as rust from './rust/src/lib.js'

const settings = { theme: 'dark', fontSize: 14 }
js.enlarge(settings)
console.log(`const settings = { fontSize: 14 }; enlarge(settings)`)
console.log(`  js:   settings.fontSize is now ${settings.fontSize}: const didn't stop it`)
console.log(`  rust: enlarge(&mut settings), and settings must be \`let mut\`, or it won't compile`)
console.log(`slugify("  Hello World ")   js: ${js.slugify('  Hello World ')}   rust: ${rust.slugify('  Hello World ')}`)
