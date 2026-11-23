// The JavaScript and the Rust rust-js compiled give what cases.json records
// native Rust giving, but where JavaScript counts UTF-16 units: the emoji's
// text, which the last test pins. rust/tests/native.rs holds native Rust to
// the cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as js from './js/text.js'
import * as rust from './rust/src/lib.js'

const emoji = '😀👍 ok'

for (const { text, chars, bytes, truncated, reversed, capitalized } of cases.texts) {
  test(JSON.stringify(text), () => {
    expect(rust.charCount(text)).toBe(chars)
    expect(rust.byteSize(text)).toBe(bytes)
    expect(rust.truncate(text, 3)).toBe(truncated)
    expect(rust.reverse(text)).toBe(reversed)
    expect(rust.capitalize(text)).toBe(capitalized)
    expect(js.byteSize(text)).toBe(bytes)
    expect(js.capitalize(text)).toBe(capitalized)
    if (text !== emoji) {
      expect(js.charCount(text)).toBe(chars)
      expect(js.truncate(text, 3)).toBe(truncated)
      expect(js.reverse(text)).toBe(reversed)
    }
  })
}

for (const [names, said] of cases.greetings) {
  test(`greeting ${JSON.stringify(names)}`, () => {
    expect(rust.greetAll(names)).toBe(said)
    expect(js.greetAll(names)).toBe(said)
  })
}

test("JavaScript's length, slice and split('') count UTF-16 units, and cut emoji in half", () => {
  expect(js.charCount(emoji)).toBe(7)
  expect(js.truncate(emoji, 3)).toBe('😀\ud83d…')
  expect(js.reverse(emoji)).toBe('ko \udc4d😀\ud83d')
  expect(js.reverse(emoji).isWellFormed()).toBe(false)
})
