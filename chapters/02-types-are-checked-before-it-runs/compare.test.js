// The JavaScript and the Rust rust-js compiled give what cases.json records
// native Rust giving, but where JavaScript's own checks differ, which the
// tests at the end pin. rust/tests/native.rs holds native Rust to the cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as js from './js/cart.js'
import * as rust from './rust/src/lib.js'

for (const [name, age, said] of cases.greetings) {
  test(`greet ${name}`, () => {
    expect(rust.greet({ name, age })).toBe(said)
    expect(js.greet({ name, age })).toBe(said)
  })
}

for (const [n, next] of cases.next) {
  test(`one more than ${n}`, () => {
    expect(rust.nextQuantity(n)).toBe(next)
    expect(js.nextQuantity(n)).toBe(next)
  })
}

// parseInt takes the digits it finds at the start: "2.5" is 2, "12abc" 12.
const parseIntReads = { '2.5': 2, '12abc': 12 }

for (const [text, n] of cases.parsed) {
  test(`the quantity typed as ${JSON.stringify(text)}`, () => {
    expect(rust.parseQuantity(text)).toBe(n)
    expect(js.parseQuantity(text)).toBe(parseIntReads[text] ?? n)
  })
}

for (const [n, said] of cases.labels) {
  test(`the label of ${n}`, () => {
    expect(rust.itemsLabel(n)).toBe(said)
    expect(js.itemsLabel(n)).toBe(said)
  })
}

test('a mistyped property is undefined, and printed', () => {
  expect(js.greetMistyped({ name: 'Ada', age: 36 })).toBe('Hello, undefined!')
})

test("a form's string, given where a number belongs, is joined to, not added to", () => {
  expect(js.nextQuantity('2')).toBe('21')
})

test("from JavaScript, the Rust's u32 isn't checked yet: '2' + 1 is '21', then made a number", () => {
  // rust-js#2403 checks what JavaScript gives Rust; until it lands, a
  // string slips through to `(current + 1) >>> 0`.
  expect(rust.nextQuantity('2')).toBe(21)
})
