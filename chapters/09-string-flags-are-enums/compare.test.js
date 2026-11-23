// The JavaScript and the Rust rust-js compiled give what cases.json records
// native Rust giving, of the very same objects, but a shipped order, which
// JavaScript's misspelled case misses. rust/tests/native.rs holds native
// Rust to the same cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as js from './js/orders.js'
import * as rust from './rust/src/lib.js'

for (const c of cases) {
  test(`the ${c.order.state} order`, () => {
    expect(rust.describe(c.order)).toBe(c.describe)
    expect(rust.canCancel(c.order)).toBe(c.can_cancel)
    expect(rust.ship(c.order, 'TRK1')).toEqual(c.shipped)
    expect(js.canCancel(c.order)).toBe(c.can_cancel)
    expect(js.ship(c.order, 'TRK1')).toEqual(c.shipped)
    if (c.order.state !== 'shipped') expect(js.describe(c.order)).toBe(c.describe)
  })
}

test("a misspelled state never matches: the shipped order is 'unknown'", () => {
  expect(js.describe({ state: 'shipped', tracking: 'TRK0' })).toBe('unknown')
})

test('a state that has no tracking reads one anyway: undefined', () => {
  const order = { state: 'pending' }
  expect(order.tracking).toBeUndefined()
})
