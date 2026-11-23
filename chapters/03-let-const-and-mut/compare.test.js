// The JavaScript and the Rust rust-js compiled give what cases.json records
// native Rust giving. rust/tests/native.rs holds native Rust to the cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as js from './js/settings.js'
import * as rust from './rust/src/lib.js'

for (const [title, slug] of cases.slugs) {
  test(`the slug of ${JSON.stringify(title)}`, () => {
    expect(rust.slugify(title)).toBe(slug)
    expect(js.slugify(title)).toBe(slug)
  })
}

for (const [from, numbers] of cases.countdowns) {
  test(`counting down from ${from}`, () => {
    expect(rust.countdown(from)).toEqual(numbers)
    expect(js.countdown(from)).toEqual(numbers)
  })
}

for (const [adding, added, after] of cases.tags) {
  test(`adding ${JSON.stringify(adding)}`, () => {
    for (const addTag of [rust.addTag, js.addTag]) {
      const tags = []
      expect(adding.map((tag) => addTag(tags, tag))).toEqual(added)
      expect(tags).toEqual(after)
    }
  })
}

test('bigger makes new settings; enlarge changes the ones it is given', () => {
  for (const side of [rust, js]) {
    const settings = { theme: 'dark', fontSize: 14 }
    expect(side.bigger(settings).fontSize).toBe(16)
    expect(settings.fontSize).toBe(14)
    side.enlarge(settings)
    expect(settings.fontSize).toBe(16)
  }
})

test("JavaScript's const keeps the name, not what's in it", () => {
  const settings = { theme: 'dark', fontSize: 14 }
  js.enlarge(settings)
  expect(settings.fontSize).toBe(16)
  const tags = []
  tags.push('allowed')
  expect(tags).toEqual(['allowed'])
})

test('the const is a value JavaScript reads', () => {
  expect(rust.MAX_TAGS).toBe(3)
  expect(js.MAX_TAGS).toBe(3)
})
