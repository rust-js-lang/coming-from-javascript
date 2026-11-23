// bun chapters/21-npm-is-cargo/compare.js: a blog's index, both ways.
import cases from './cases.json'
import * as js from './js/index.js'
import * as rustPosts from './rust/src/posts.js'

const posts = cases[0].posts.map(([title, words]) => ({ title, body: Array(words).fill('word').join(' ') }))
console.log(`js:   ${JSON.stringify(js.index(posts))}`)
console.log(`rust: ${JSON.stringify(rustPosts.index(posts))}`)
