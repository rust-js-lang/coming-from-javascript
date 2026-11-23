// The JavaScript and the Rust rust-js compiled give what cases.json records
// native Rust giving; the feed, which calls JavaScript's `relativeTime`
// from Rust, is held to the JavaScript's own. rust/tests/native.rs holds
// native Rust to the cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as js from './js/time.js'
import * as rust from './rust/src/lib.js'

const events = cases.events.map(([who, did, at]) => ({ who, did, at }))
const notBots = (e) => e.who !== 'bot'

test('the events kept, with a JavaScript function given where Rust takes a closure', () => {
  expect(rust.kept(events, notBots).map((e) => e.who)).toEqual(cases.kept)
})

test("the feed: Rust's lines in JavaScript's Intl words", () => {
  for (const now of [86400, 90000, 200000]) {
    expect(rust.feed(events, now, notBots)).toEqual(js.feed(events, now, notBots))
  }
  expect(rust.feed(events, 86400, notBots)).toEqual([
    'ada pushed a fix, 23 hours ago',
    'grace merged it, 2 hours ago',
    'linus said thanks, 1 minute ago',
  ])
})

for (const [name, greeting, said] of cases.greetings) {
  test(`greeting ${name}`, () => {
    // A trailing Option is an optional parameter: left out, or given.
    expect(greeting === null ? rust.greet(name) : rust.greet(name, greeting)).toBe(said)
    expect(greeting === null ? js.greet(name) : js.greet(name, greeting)).toBe(said)
  })
}

test("today, kept's events are the caller's own objects (rust-js#2408)", () => {
  const mine = [{ who: 'ada', did: 'pushed', at: 0 }]
  const kept = rust.kept(mine, () => true)
  kept[0].who = 'changed'
  expect(mine[0].who).toBe('changed')
})
