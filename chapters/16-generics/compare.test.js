// The JavaScript and the Rust rust-js compiled give what cases.json records
// native Rust giving; JavaScript's `largest` also takes lists Rust won't,
// as the last test pins. rust/tests/native.rs holds native Rust to the cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as js from './js/generic.js'
import * as rust from './rust/src/lib.js'

for (const [scores, highest] of cases.scores) {
  test(`the highest of ${JSON.stringify(scores)}`, () => {
    expect(rust.highestScore(scores) ?? null).toBe(highest)
    expect(js.largest(scores) ?? null).toBe(highest)
  })
}

for (const [words, last] of cases.words) {
  test(`the last of ${JSON.stringify(words)}`, () => {
    expect(rust.lastWord(words) ?? null).toBe(last)
    expect(js.largest(words) ?? null).toBe(last)
  })
}

for (const [text, ok] of cases.brackets) {
  test(`${JSON.stringify(text)} is ${ok ? '' : 'not '}balanced`, () => {
    expect(rust.balanced(text)).toBe(ok)
    expect(js.balanced(text)).toBe(ok)
  })
}

test("a generic struct from JavaScript: a plain object, and Stack's functions", () => {
  const stack = rust.Stack.new()
  rust.Stack.push(stack, 'first')
  rust.Stack.push(stack, 'second')
  expect(stack).toEqual({ items: ['first', 'second'] })
  expect(rust.Stack.pop(stack)).toBe('second')
})

test("JavaScript's largest takes anything, and answers anyway", () => {
  // Objects have no order: `>` is always false, so the first wins.
  expect(js.largest([{ price: 3 }, { price: 9 }])).toEqual({ price: 3 })
  // Mixed types: '10' > 2 compares as numbers, 1 > 'b' is false.
  expect(js.largest([2, '10'])).toBe('10')
  expect(js.largest(['b', 1, 'a'])).toBe('b')
})
