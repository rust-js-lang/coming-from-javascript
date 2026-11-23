// The JavaScript and the Rust rust-js compiled give what cases.json records
// native Rust giving, but where JavaScript's one kind of number gives
// another answer, which the tests at the end pin. rust/tests/native.rs
// holds native Rust to the cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as js from './js/numbers.js'
import * as rust from './rust/src/lib.js'

for (const [total, people, split] of cases.bills) {
  test(`${total} cents split ${people} ways`, () => {
    expect(rust.splitBill(total, people)).toEqual(split)
    expect(js.splitBill(total, people)).toEqual(split)
  })
}

for (const [scores, mean] of cases.averages) {
  test(`the average of ${JSON.stringify(scores)}`, () => {
    expect(rust.average(scores)).toBe(mean)
    expect(js.average(scores)).toBe(mean)
  })
}

for (const [part, whole, pct] of cases.percents) {
  test(`${part} of ${whole} as a percent`, () => {
    expect(rust.percent(part, whole)).toBe(pct)
    // 1 / 0 is Infinity: Rust's `as u32` makes it u32's largest, JavaScript keeps it.
    expect(js.percent(part, whole)).toBe(whole === 0 ? Infinity : pct)
  })
}

for (const [id, next] of cases.ids) {
  test(`the id after ${id}`, () => {
    // A u64 is a bigint in JavaScript: every digit kept.
    expect(rust.nextId(BigInt(id))).toBe(BigInt(next))
  })
}

for (const [lives, more, total] of cases.lives) {
  test(`${lives} lives and ${more} more`, () => {
    expect(rust.addLives(lives, more)).toBe(total)
    expect(js.addLives(lives, more)).toBe(total)
  })
}

test('past 2 ** 53 a float rounds: the next id is this one', () => {
  expect(js.nextId(9007199254740992)).toBe(9007199254740992)
  expect(rust.nextId(9007199254740992n)).toBe(9007199254740993n)
})

test('dividing whole numbers by zero panics in Rust; JavaScript gives Infinity and NaN', () => {
  expect(() => rust.splitBill(1000, 0)).toThrow('attempt to divide by zero')
  expect(js.splitBill(1000, 0)).toEqual([Infinity, NaN])
})

test('the average of nothing is NaN, both ways', () => {
  expect(rust.average([])).toBeNaN()
  expect(js.average([])).toBeNaN()
})
