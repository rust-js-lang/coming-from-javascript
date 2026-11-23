// The Rust rust-js compiled gives what cases.json records native Rust
// giving; the JavaScript, comparing objects by which object they are,
// doesn't, as each test says. rust/tests/native.rs holds native Rust to the
// same cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as js from './js/equality.js'
import * as rust from './rust/src/lib.js'

const point = ([x, y]) => ({ x, y })

for (const [a, b, same] of cases.pairs) {
  test(`${JSON.stringify(a)} and ${JSON.stringify(b)}`, () => {
    expect(rust.samePoint(point(a), point(b))).toBe(same)
    // Two objects made apart are never ===, whatever's in them.
    expect(js.samePoint(point(a), point(b))).toBe(false)
  })
}

for (const [walk, lookedFor, there, unique] of cases.walks) {
  test(`the walk ${JSON.stringify(walk)}`, () => {
    const points = walk.map(point)
    expect(rust.containsPoint(points, point(lookedFor))).toBe(there)
    expect(rust.uniquePoints(points)).toEqual(unique.map(point))
    // `includes` and `Set` find only the very same object.
    expect(js.containsPoint(points, point(lookedFor))).toBe(false)
    expect(js.uniquePoints(points)).toHaveLength(points.length)
  })
}

for (const [versions, sorted] of cases.versions) {
  test(`sorting ${JSON.stringify(versions)}`, () => {
    expect(rust.sortVersions(versions)).toEqual(sorted)
    expect(js.sortVersionsNumerically(versions)).toEqual(sorted)
  })
}

test("sort() with no comparator sorts version numbers as strings", () => {
  expect(js.sortVersions(['1.10.0', '1.2.0', '1.9.3'])).toEqual(['1.10.0', '1.2.0', '1.9.3'])
  expect(js.sortVersions(['2.0.0', '10.0.0'])).toEqual(['10.0.0', '2.0.0'])
})

test('the same object is === itself', () => {
  const p = { x: 1, y: 2 }
  expect(js.samePoint(p, p)).toBe(true)
  expect(js.containsPoint([p], p)).toBe(true)
})

test("JavaScript's == turns values into others before comparing", () => {
  expect(0 == '').toBe(true)
  expect('1' == 1).toBe(true)
  expect(null == undefined).toBe(true)
  expect(NaN === NaN).toBe(false)
})
