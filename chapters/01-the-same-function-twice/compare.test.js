// The JavaScript and the Rust rust-js compiled give what cases.json records
// native Rust giving, case by case, but one: `word[0]` of an emoji is half
// of it in JavaScript. rust/tests/native.rs holds native Rust to the same
// cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as js from './js/basics.js'
import * as rust from './rust/src/lib.js'

for (const [n, said] of cases.fizzbuzz) {
  test(`fizzbuzz(${n})`, () => {
    expect(rust.fizzbuzz(n)).toBe(said)
    expect(js.fizzbuzz(n)).toBe(said)
  })
}

for (const [prices, sum] of cases.totals) {
  test(`total(${JSON.stringify(prices)})`, () => {
    expect(rust.total(prices)).toBe(sum)
    expect(js.total(prices)).toBe(sum)
  })
}

for (const [name, said] of cases.initials) {
  test(`initials(${JSON.stringify(name)})`, () => {
    expect(rust.initials(name)).toBe(said)
    if (!name.startsWith('😀')) expect(js.initials(name)).toBe(said)
  })
}

test("JavaScript's word[0] of an emoji is half of it", () => {
  // An emoji is two UTF-16 units; `[0]` is the first, which isn't a
  // character on its own. Rust's `chars()` gives the whole one.
  expect(js.initials('😀 smile')).toBe('\ud83dS')
  expect(rust.initials('😀 smile')).toBe('😀S')
})
