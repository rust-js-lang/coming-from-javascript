// The JavaScript, which throws, and the Rust rust-js compiled, which
// returns a `Result`, refuse the same forms in the same words, as
// cases.json records native Rust doing, but two ages `Number()` reads its
// own way, which the last test pins. rust/tests/native.rs holds native Rust
// to the same cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as js from './js/signup.js'
import * as rust from './rust/src/lib.js'

const jsReadsOwnWay = new Set(['300', '0x1A'])

for (const { form: [email, password, age], outcome, message } of cases) {
  const form = { email, password, age }
  test(`signing up ${JSON.stringify(form)}`, () => {
    const result = rust.signUp(form)
    expect(result.TAG === 'Ok' ? { Ok: result._0 } : { Err: result._0 }).toEqual(outcome)
    expect(rust.message(form)).toBe(message)
    if (jsReadsOwnWay.has(age)) return
    expect(js.message(form)).toBe(message)
    if ('Ok' in outcome) expect(js.signUp(form)).toEqual(outcome.Ok)
    else expect(() => js.signUp(form)).toThrow()
  })
}

test("Number() reads '0x1A' as 26, and '300' as a number to range-check", () => {
  const form = (age) => ({ email: 'ada@example.com', password: 'correct horse', age })
  expect(js.signUp(form('0x1A'))).toEqual({ email: 'ada@example.com', age: 26 })
  expect(js.message(form('300'))).toBe('sorry: 300 is out of range')
  expect(rust.message(form('300'))).toBe('sorry: "300" isn\'t an age')
})

test("Rust's problem is a value to switch on, not a message to parse", () => {
  const result = rust.signUp({ email: 'ada@example.com', password: 'short', age: '36' })
  expect(result).toEqual({ TAG: 'Err', _0: { problem: 'short-password', min: 8 } })
})

test("JavaScript's catch catches a bug's TypeError too, as if it were the form's problem", () => {
  expect(js.message({ email: 'ada@example.com', age: '36' })).toStartWith('sorry: ')
})
