// The JavaScript and the Rust rust-js compiled give what cases.json records
// native Rust giving, but three ids `Number()` reads its own way, which
// the last test pins. rust/tests/native.rs holds native Rust to the cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as js from './js/router.js'
import * as rust from './rust/src/lib.js'

const numberReads = { '/users/abc': 'User NaN', '/users/-1': 'User -1', '/users/4.5': 'User 4.5' }

for (const { path, title, user_id } of cases) {
  test(path, () => {
    expect(rust.title(path)).toBe(title)
    expect(rust.userId(path) ?? null).toBe(user_id)
    expect(js.title(path)).toBe(numberReads[path] ?? title)
  })
}

test("rust-js's route is the object JavaScript's is", () => {
  expect(rust.route('/users/42')).toEqual(js.route('/users/42'))
  expect(rust.route('/files/docs/a.md')).toEqual({ page: 'file', path: 'docs/a.md' })
})

test('Number() makes an id of anything: NaN, negative, a fraction', () => {
  expect(js.route('/users/abc')).toEqual({ page: 'user', id: NaN })
  expect(rust.route('/users/abc')).toEqual({ page: 'not-found' })
})
