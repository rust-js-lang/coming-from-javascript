// bun chapters/07-objects-are-structs/compare.js: a to-do, both ways.
import * as js from './js/todo.js'
import * as rust from './rust/src/lib.js'

const todo = new js.Todo('buy milk')
js.markDoneMistyped(todo)
console.log(`todo.donee = true`)
console.log(`  js:   ${todo.summary()}, and now it has a 'donee' too`)
console.log(`  rust: won't compile: no field donee on type Todo`)
let threw
try {
  js.summariesLosingThis([todo])
} catch (error) {
  threw = error.message
}
console.log(`todos.map(Todo.prototype.summary)`)
console.log(`  js:   throws: ${threw}`)
console.log(`  rust: ${JSON.stringify(rust.summaries([rust.Todo.new('buy milk')]))}, from todos.iter().map(Todo::summary)`)
