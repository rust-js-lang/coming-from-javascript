// The JavaScript and the Rust rust-js compiled give what cases.json records
// native Rust giving. rust/tests/native.rs holds native Rust to the cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as js from './js/users.js'
import * as rust from './rust/src/lib.js'

for (const [id, said] of cases.greetings) {
  test(`greeting user ${id}`, async () => {
    expect(await rust.greeting(id)).toBe(said)
    expect(await js.greeting(id)).toBe(said)
  })
}

for (const [ids, total] of cases.totals) {
  test(`the ages of ${JSON.stringify(ids)}`, async () => {
    const result = await rust.totalAge(ids)
    expect(result.TAG === 'Ok' ? { Ok: result._0 } : { Err: result._0 }).toEqual(total)
    if ('Ok' in total) expect(await js.totalAge(ids)).toBe(total.Ok)
    else await expect(js.totalAge(ids)).rejects.toThrow(total.Err)
  })
}

test('a forgotten await reads a property of the promise: undefined', () => {
  expect(js.greetingForgotten(1)).toBe('Hello, undefined!')
})

test("an async fn is an async function: it gives a Promise", () => {
  expect(rust.greeting(1)).toBeInstanceOf(Promise)
})
