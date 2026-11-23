// The JavaScript and the Rust rust-js compiled give what cases.json records
// native Rust giving, but where JavaScript's `var` shares one variable
// among the closures, which the last test pins. rust/tests/native.rs holds
// native Rust to the same cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as js from './js/closures.js'
import * as rust from './rust/src/lib.js'

for (const [count, made] of cases.adders) {
  test(`${count} adders, each given 10`, () => {
    expect(rust.adders(count)).toEqual(made)
    expect(js.adders(count)).toEqual(made)
  })
}

for (const [ns, twice] of cases.twice_each) {
  test(`each of ${JSON.stringify(ns)} added twice to 10`, () => {
    expect(rust.twiceEach(ns)).toEqual(twice)
    expect(ns.map((n) => js.applyTwice(js.adder(n), 10))).toEqual(twice)
  })
}

test('a counter counts, and two count apart', () => {
  for (const side of [rust, js]) {
    const next = side.counter()
    expect(cases.counted.map(() => next())).toEqual(cases.counted)
    const other = side.counter()
    expect(other()).toBe(1)
  }
})

for (const [n, x, twice] of cases.added_twice) {
  test(`adder(${n}) applied twice to ${x}`, () => {
    // A Rust function returned to JavaScript is a JavaScript function, and
    // a JavaScript function is what a Rust `impl Fn` parameter takes.
    expect(rust.applyTwice(rust.adder(n), x)).toBe(twice)
    expect(rust.applyTwice(js.adder(n), x)).toBe(twice)
    expect(js.applyTwice(rust.adder(n), x)).toBe(twice)
  })
}

test('with var, every closure sees the one i, after the loop', () => {
  expect(js.addersWithVar(3)).toEqual([13, 13, 13])
})
