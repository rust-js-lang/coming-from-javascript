// The JavaScript and the Rust rust-js compiled give what cases.json records
// native Rust giving, where JavaScript's are written with care; the splice
// inside a loop is pinned at the end. rust/tests/native.rs holds native Rust
// to the same cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as js from './js/tasks.js'
import * as rust from './rust/src/lib.js'

const make = (rows) => rows.map(([title, done]) => ({ title, done }))
const titles = (tasks) => tasks.map((t) => t.title)

for (const c of cases) {
  test(`the tasks ${JSON.stringify(c.tasks)}`, () => {
    for (const side of [rust, js]) {
      expect(side.pendingCount(make(c.tasks))).toBe(c.pending)
      const removed = make(c.tasks)
      side.removeDone(removed)
      expect(titles(removed)).toEqual(c.after_remove)
      const swapped = make(c.tasks)
      side.swapEnds(swapped)
      expect(titles(swapped)).toEqual(c.after_swap)
      const all = make(c.tasks)
      side.markAllDone(all)
      expect(side.pendingCount(all)).toBe(0)
    }
  })
}

test('splice inside forEach skips the task after each one it removes', () => {
  const tasks = make(cases[0].tasks)
  js.removeDoneWithSplice(tasks)
  expect(titles(tasks)).toEqual(['eggs', 'bread'])
})
