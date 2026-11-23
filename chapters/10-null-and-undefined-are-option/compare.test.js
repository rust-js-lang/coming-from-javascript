// The JavaScript and the Rust rust-js compiled give what cases.json records
// native Rust giving, but Ada's volume, which `||` turns from 0 into 50.
// "Missing" is `undefined` from both, `null` in the JSON. rust/tests/native.rs
// holds native Rust to the same cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as js from './js/profiles.js'
import * as rust from './rust/src/lib.js'
import { team } from './team.js'

for (const c of cases) {
  test(c.name, () => {
    const person = team.find((p) => p.name === c.name)
    expect(person ? rust.displayName(person) : null).toBe(c.display_name)
    expect(person ? js.displayName(person) : null).toBe(c.display_name)
    expect(person ? rust.volume(person) : null).toBe(c.volume)
    expect(person ? js.volumeKept(person) : null).toBe(c.volume)
    expect(rust.managersName(team, c.name) ?? null).toBe(c.managers_name)
    expect(js.managersName(team, c.name) ?? null).toBe(c.managers_name)
  })
}

test('|| turns a muted 0 into the default', () => {
  const ada = team[0]
  expect(js.volume(ada)).toBe(50)
  expect(js.volumeKept(ada)).toBe(0)
  expect(rust.volume(ada)).toBe(0)
})

test("Rust's None, given from JavaScript, may be undefined or null", () => {
  expect(rust.displayName({ name: 'Ada', nickname: undefined })).toBe('Ada')
  expect(rust.displayName({ name: 'Ada', nickname: null })).toBe('Ada')
})
