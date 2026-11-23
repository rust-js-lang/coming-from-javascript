// The JavaScript modules and the Rust crate rust-js compiled give what
// cases.json records native Rust giving. rust/tests/native.rs holds native
// Rust to the same cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as js from './js/index.js'
import * as rustPosts from './rust/src/posts.js'

const post = (title, words) => ({ title, body: Array(words).fill('word').join(' ') })

for (const c of cases) {
  test(`the index of ${JSON.stringify(c.posts)}`, () => {
    const posts = c.posts.map(([title, words]) => post(title, words))
    expect(rustPosts.index(posts)).toEqual(c.index)
    expect(js.index(posts)).toEqual(c.index)
  })
}

test("a Post's functions are on posts.js's Post, which the crate's root re-exports as a type", () => {
  expect(rustPosts.Post.slug({ title: 'Hello World', body: '' })).toBe('hello-world')
})

test('a pub(crate) helper is JavaScript like any other, but undeclared', async () => {
  const text = await import('./rust/src/text.js')
  expect(text.words('one two three')).toBe(3)
})
