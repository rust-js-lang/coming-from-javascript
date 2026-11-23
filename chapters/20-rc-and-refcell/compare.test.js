// The JavaScript and the Rust rust-js compiled give what cases.json records
// native Rust giving. rust/tests/native.rs holds native Rust to the cases,
// and that its RefCell refuses a writer while it lends a reader.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as js from './js/shop.js'
import * as rust from './rust/src/lib.js'

for (const [items, badges] of cases.shopping) {
  test(`shopping for ${JSON.stringify(items)}`, () => {
    expect(rust.shop(items)).toEqual(badges)
    expect(js.shop(items)).toEqual(badges)
  })
}

test('the cart has three owners: the page, the header and the checkout', () => {
  expect(rust.owners()).toBe(cases.owners)
})

test('a RefCell refuses a writer while it lends a reader, as native Rust does', () => {
  expect(() => rust.readWhileAdding()).toThrow('RefCell already borrowed')
  expect(js.readWhileAdding()).toBe(2)
})
