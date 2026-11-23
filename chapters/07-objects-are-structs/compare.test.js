// The JavaScript and the Rust rust-js compiled give what cases.json records
// native Rust giving. rust/tests/native.rs holds native Rust to the cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as js from './js/todo.js'
import * as rust from './rust/src/lib.js'

for (const c of cases) {
  test(`${JSON.stringify(c.titles)}, then ${JSON.stringify(c.steps)}`, () => {
    // Rust's: plain objects, and functions that take them.
    const plain = c.titles.map((title) => rust.Todo.new(title))
    for (const [step, at] of c.steps) rust.Todo[step](plain[at])
    expect(rust.summaries(plain)).toEqual(c.summaries)
    expect(rust.remaining(plain)).toBe(c.remaining)
    // JavaScript's: a class's instances, and their methods.
    const instances = c.titles.map((title) => new js.Todo(title))
    for (const [step, at] of c.steps) instances[at][step]()
    expect(js.summaries(instances)).toEqual(c.summaries)
    expect(js.remaining(instances)).toBe(c.remaining)
  })
}

test('a mistyped property makes a new one, and the to-do stays undone', () => {
  const todo = new js.Todo('buy milk')
  js.markDoneMistyped(todo)
  expect(todo.done).toBe(false)
  expect(todo.donee).toBe(true)
})

test('a method passed on its own loses `this`', () => {
  expect(() => js.summariesLosingThis([new js.Todo('buy milk')])).toThrow(TypeError)
})

test("rust-js's to-do is a plain object, its methods functions that take it", () => {
  const todo = rust.Todo.new('buy milk')
  expect(todo).toEqual({ title: 'buy milk', done: false, priority: 1 })
  expect([todo].map(rust.Todo.summary)).toEqual(['[ ] buy milk (p1)'])
})
