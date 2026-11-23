// The JavaScript, with a `Map`, and the Rust rust-js compiled give what
// cases.json records native Rust giving; with a plain object, JavaScript
// counts "constructor" from a function, as the last test pins.
// rust/tests/native.rs holds native Rust to the same cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as js from './js/words.js'
import * as rust from './rust/src/lib.js'

const byKey = (entries) => [...entries].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))

for (const [text, sorted] of cases.counts) {
  test(`the words of ${JSON.stringify(text)}`, () => {
    // A HashMap is a Map: its order is no promise, so sorted to compare.
    expect(rust.wordCounts(text)).toBeInstanceOf(Map)
    expect(byKey(rust.wordCounts(text))).toEqual(sorted)
    expect(byKey(js.wordCounts(text))).toEqual(sorted)
    expect(rust.sortedCounts(text)).toEqual(sorted)
    expect(js.sortedCounts(text)).toEqual(sorted)
  })
}

for (const [a, b, shared] of cases.shared) {
  test(`the words ${JSON.stringify(a)} and ${JSON.stringify(b)} share`, () => {
    expect(rust.sharedWords(a, b)).toEqual(shared)
    expect(js.sharedWords(a, b)).toEqual(shared)
  })
}

test('a plain object counts "constructor" from the function every object has', () => {
  const counts = js.wordCountsObject('The constructor of the toString')
  expect(counts.constructor).toBe('function Object() { [native code] }1')
  expect(counts.the).toBe(2)
})

test("a plain object's keys are strings: 1 and '1' are one key", () => {
  const prices = {}
  prices[1] = 'one'
  prices['1'] = 'uno'
  expect(Object.keys(prices)).toEqual(['1'])
})
