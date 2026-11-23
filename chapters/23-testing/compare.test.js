// The JavaScript and the Rust rust-js compiled give what cases.json records
// native Rust giving. rust/tests/native.rs holds native Rust to the same
// cases, and `rust-js test` runs it and lib.rs's unit tests as JavaScript.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as js from './js/password.js'
import * as rust from './rust/src/lib.js'

for (const [password, said] of cases.passwords) {
  test(`how strong ${JSON.stringify(password)} is`, () => {
    expect(rust.strength(password)).toBe(said)
    expect(js.strength(password)).toBe(said)
  })
}

for (const [scores, mean] of cases.averages) {
  test(`the average of ${JSON.stringify(scores)}`, () => {
    expect(rust.average(scores)).toBe(mean)
    expect(js.average(scores)).toBe(mean)
  })
}

test('averaging nothing panics in Rust, and is NaN in JavaScript', () => {
  expect(() => rust.average([])).toThrow('no scores to average')
  expect(js.average([])).toBeNaN()
})
