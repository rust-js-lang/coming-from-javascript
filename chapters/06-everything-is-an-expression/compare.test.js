// The JavaScript and the Rust rust-js compiled give what cases.json records
// native Rust giving, but friday, where JavaScript's `switch` falls through.
// rust/tests/native.rs holds native Rust to the same cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as js from './js/expressions.js'
import * as rust from './rust/src/lib.js'

for (const [total, cents] of cases.shipping) {
  test(`shipping on ${total} cents`, () => {
    expect(rust.shipping(total)).toBe(cents)
    expect(js.shipping(total)).toBe(cents)
  })
}

for (const [score, letter] of cases.grades) {
  test(`the grade of ${score}`, () => {
    expect(rust.grade(score)).toBe(letter)
    expect(js.grade(score)).toBe(letter)
  })
}

for (const [day, kind] of cases.days) {
  test(`what kind of day ${day} is`, () => {
    expect(rust.dayKind(day)).toBe(kind)
    if (day !== 'fri') expect(js.dayKind(day)).toBe(kind)
  })
}

for (const [n, steps] of cases.steps) {
  test(`steps from ${n} to 1`, () => {
    // A u64 is a bigint in JavaScript (chapter 4).
    expect(rust.stepsToOne(BigInt(n))).toBe(steps)
    expect(js.stepsToOne(n)).toBe(steps)
  })
}

test("a forgotten break: friday falls through to the weekdays' case", () => {
  expect(js.dayKind('fri')).toBe('weekday')
  expect(rust.dayKind('fri')).toBe('almost weekend')
})
