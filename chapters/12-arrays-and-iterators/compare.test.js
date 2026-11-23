// The JavaScript and the Rust rust-js compiled give what cases.json records
// native Rust giving, where JavaScript's are written with care; the
// careless ones are pinned at the end. rust/tests/native.rs holds native
// Rust to the same cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as js from './js/scores.js'
import * as rust from './rust/src/lib.js'

for (const c of cases.scores) {
  test(`the scores ${JSON.stringify(c.scores)}`, () => {
    const scores = [...c.scores]
    expect(rust.topThree(scores)).toEqual(c.top_three)
    expect(scores).toEqual(c.scores)
    expect(js.topThreeCopied(scores)).toEqual(c.top_three)
    expect(rust.highest(scores) ?? null).toBe(c.highest)
    expect([0, 1, 10].map((i) => rust.scoreAt(scores, i) ?? null)).toEqual(c.at)
    expect([0, 1, 10].map((i) => js.scoreAt(scores, i) ?? null)).toEqual(c.at)
  })
}

for (const [rows, names, failing] of cases.classes) {
  const students = rows.map(([name, score]) => ({ name, score }))
  test(`the class ${JSON.stringify(rows)}`, () => {
    expect(rust.passed(students)).toEqual(names)
    expect(js.passed(students)).toEqual(names)
    expect(rust.firstFailing(students) ?? null).toBe(failing)
    expect(js.firstFailing(students) ?? null).toBe(failing)
  })
}

test("sort() sorts the caller's array, in place, as strings", () => {
  const scores = [9, 100, 85, 10]
  expect(js.topThree(scores)).toEqual([9, 85, 100])
  expect(scores).toEqual([9, 85, 100, 10])
})

test('the highest of no scores is -Infinity in JavaScript, None in Rust', () => {
  expect(js.highest([])).toBe(-Infinity)
  expect(rust.highest([])).toBeUndefined()
})
