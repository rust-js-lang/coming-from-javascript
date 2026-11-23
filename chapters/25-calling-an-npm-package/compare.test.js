// Rust calls the `till` package through its bindings; js/checkout.js makes
// the same calls by hand. Each pair must give the same answers, and the JS
// rust-js wrote must build each argument as a person would.
import { expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import * as js from './js/checkout.js'
import * as rust from './rust/src/lib.js'

const written = readFileSync(join(import.meta.dir, 'rust/src/lib.js'), 'utf8')

const items = [
  { name: 'tea', cents: 350, qty: 2 },
  { name: 'cake', cents: 425 },
]

test('Rust and JavaScript make the same calls and get the same answers', () => {
  for (const cents of [0, 99, 1999, 123456]) {
    for (const name of ['monies', 'prices', 'rounded', 'discounts', 'clamped', 'taxes', 'coupons']) {
      expect([name, rust[name](cents)]).toEqual([name, js[name](cents)])
    }
  }
  expect(rust.padded('tea')).toEqual(js.padded('tea'))
  expect(rust.count(items)).toEqual(js.count(items))
  expect(rust.lines('the corner shop', ['tea', 'cake', 'paid'])).toEqual(js.lines('the corner shop', ['tea', 'cake', 'paid']))
  expect(rust.labels('tea')).toEqual(js.labels('tea'))
  expect(rust.described()).toEqual(js.described())
  expect(rust.ringUp(items)).toEqual(js.ringUp(items))
  for (const coupon of [undefined, null, { kind: 'percent', percent: 10 }, { kind: 'fixed', cents: 300 }]) {
    expect(rust.orderTotal('ada', coupon)).toEqual(js.orderTotal('ada', coupon))
  }
})

test('the answers themselves', () => {
  expect(rust.monies(1999)).toEqual(['€19.99', '19.99 EUR'])
  expect(rust.padded('tea')).toEqual(['         tea', '   tea'])
  expect(rust.prices(1999)).toEqual(['$19.99', '€19.99', '20 GBP'])
  expect(rust.rounded(1999)).toEqual([2000, 1975, 2000])
  expect(rust.discounts(1999)).toEqual([1849, 1799])
  expect([rust.clamped(50), rust.clamped(9999)]).toEqual([100, 5000])
  expect(rust.count(items)).toBe(3)
  expect(rust.lines('the corner shop', ['tea', 'paid'])).toEqual(['the corner shop · thank you', 'tea · paid'])
  expect(rust.labels('tea')).toEqual(['tea (decaf)', 'tea'])
  expect(rust.taxes(1000)).toBe(215)
  expect(rust.coupons(1999)).toEqual([1799, 1699])
  expect(rust.orderTotal('ada')).toBe(1125)
  expect(rust.orderTotal('ada', { kind: 'fixed', cents: 125 })).toBe(1000)
  expect(rust.described()).toEqual([
    '{"name":"tea","cents":350}',
    '{"kind":"fixed","cents":300}',
    '[1,"one"]',
    '["up","down"]',
  ])
  expect(rust.ringUp(items)).toEqual([['tea £7.00', 'cake £4.25'], 1125])
})

// What the chapter's README shows: each argument as rust-js writes it.
test.each([
  ['a left-out parameter is no argument', 'pad(text), pad(text, 6)'],
  ['an options object has only the fields given', 'price(cents, { currency: "EUR" })'],
  ["an enum's variants are their strings", '["up", "down", "nearest"]'],
  ['a union takes either member as it is', 'discount(cents, 150), discount(cents, "10%")'],
  ['a tuple is an array', 'clamp(cents, [100, 5000])'],
  ['a closure is a function', 'sumBy(items, (item) => item.qty ?? 1)'],
  ['a tuple of rest arguments is the arguments, a slice is spread', 'line(shop, "thank you"), line(...parts)'],
  ["a nullable parameter's None is null", 'label(name, null)'],
  ['a Dict is an object', 'tax(cents, { vat: 0.2, city: 0.015 })'],
  ['a tagged enum is an object of its tag', 'applyCoupon(cents, { kind: "percent", percent: 10 })'],
  ["a None field is left out", 'customer: { name }'],
  ['new is new', 'new Register({ currency: "GBP" })'],
  ['a getter is a property read', 'register.total]'],
])('%s', (_, call) => {
  expect(written).toContain(call)
})
