// The JavaScript and the Rust rust-js compiled give what cases.json records
// native Rust giving. Where JavaScript shares an array between two names,
// the tests at the end pin it. rust/tests/native.rs holds native Rust to the
// same cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as js from './js/match.js'
import * as rust from './rust/src/lib.js'

for (const [players, said] of cases.line_ups) {
  test(`the line-up of ${JSON.stringify(players)}`, () => {
    expect(rust.lineUp(rust.startMatch([...players]))).toBe(said)
    expect(js.lineUp(js.startMatch([...players]))).toBe(said)
  })
}

for (const [[home, away], atHome, [h, a]] of cases.goals) {
  test(`${home}-${away}, a goal ${atHome ? 'at home' : 'away'}`, () => {
    for (const side of [rust, js]) {
      const before = { home, away }
      expect(side.addGoal(before, atHome)).toEqual({ home: h, away: a })
      expect(before).toEqual({ home, away })
    }
  })
}

test("the match keeps the caller's array: a substitute pushed after joins it", () => {
  const players = ['ann', 'bo', 'cy', 'di', 'ed']
  const match = js.startMatch(players)
  players.push('sub')
  expect(js.lineUp(match)).toBe('ann, bo, cy, di, ed, sub (changed!)')
})

test('from JavaScript, the Rust match keeps the array it was given too: what you pass by value, you give away', () => {
  const players = ['ann', 'bo']
  const match = rust.startMatch(players)
  players.push('sub')
  expect(rust.lineUp(match)).toBe('ann, bo, sub (changed!)')
})

test("today, rust-js's two matches share one array, which a JavaScript caller can change", () => {
  // Rust's two_matches gives two independent line-ups (native.rs holds
  // that). rust-js leaves the clone out, as no Rust code changes either:
  // rust-js#2408. Until it's fixed, a change to one shows in the other.
  const [first, second] = rust.twoMatches(['ann', 'bo'])
  first.players.push('sub')
  expect(second.players).toEqual(['ann', 'bo', 'sub'])
  // JavaScript's own copies.
  const [a, b] = js.twoMatches(['ann', 'bo'])
  a.players.push('sub')
  expect(b.players).toEqual(['ann', 'bo'])
})
