# 18. Moves

From here to chapter 20 is the one idea JavaScript has no word for:
*ownership*. It starts with a bug you've probably written.

## Two names, one array

```js
// js/match.js
export function startMatch(players) {
  return { players, size: players.length }
}
```

```js
const players = ['ann', 'bo', 'cy', 'di', 'ed']
const match = startMatch(players)
players.push('sub')
```

```
  js:   ann, bo, cy, di, ed, sub (changed!)
```

The match kept the caller's array, not a copy. JavaScript objects and
arrays are shared: `players` and `match.players` are two names for one
array, and a push through either changes both. A five-a-side match now
has six players. Nothing in the code says this can happen.

## One owner

Rust's rule: **every value has exactly one owner.** Passing a `Vec` to a
function that takes it gives it away. The value *moves*, and the old
name is finished:

```rust
// rust/src/lib.rs
pub fn start_match(players: Vec<String>) -> Match {
    let size = players.len();
    Match { players, size }
}
```

```rust
let mut players = vec!["ann".to_string()];
let game = start_match(players);
players.push("sub".to_string());
```

```
error[E0382]: borrow of moved value: `players`
   ------- value moved here
   ^^^^^^^ value borrowed here after move
help: consider cloning the value if the performance cost is acceptable
```

The bug can't be written. After `start_match(players)`, only the match
owns those players, so only the match can change them.

## `clone`: a copy you ask for

When you want two independent values, say so:

```rust
pub fn two_matches(players: Vec<String>) -> (Match, Match) {
    let first = start_match(players.clone());
    let second = start_match(players);
    (first, second)
}
```

`clone` makes a full copy. It's never done for you: copying a big list
takes time and memory, so Rust makes you write it where it happens.

## `Copy`: values too small to bother moving

Numbers, `bool`, `char`, and small structs that derive `Copy` are copied
whenever they're passed, and the old name stays usable:

```rust
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Score {
    pub home: u32,
    pub away: u32,
}

pub fn add_goal(score: Score, home: bool) -> Score { /* a new score */ }
```

After `add_goal(before, true)`, `before` is still the score from before.
A `String` or a `Vec` owns memory elsewhere, so they're never `Copy`:
copying one is `clone`.

## What rust-js writes

A move costs nothing. Rust has proved nobody uses the old name, so
there's nothing to copy:

```js
// rust/src/lib.js (generated)
export function startMatch(players) {
  const size = players.length;
  return { players, size };
}
```

### At the boundary, today

Two things JavaScript callers should know, because Rust's checks don't
reach your JavaScript:

- **What you pass by value, you give away.** `startMatch(players)` from
  JavaScript keeps your array, as Rust's version does. Rust stops Rust
  code from using `players` afterwards; nothing stops JavaScript. Pass a
  copy, `startMatch([...players])`, if you still need yours.
- **A clone given back to you may be shared, for now.** rust-js leaves a
  `clone` out when no Rust code changes either copy. `twoMatches` doesn't
  change them, so today both matches it returns share one array, and
  pushing to one changes the other. That's a bug, since Rust promised two:
  [rust-js#2408](https://github.com/rust-js-lang/rust-js/issues/2408).
  Native Rust's two matches are independent (`native.rs` holds that), and
  `compare.test.js` pins what JavaScript sees today.

## Where it's different

- **Assignment moves too.** `let a = vec![1]; let b = a;` moves the
  `Vec` into `b`, and `a` is finished. In JavaScript, `const b = a` is a
  second name for the same array.
- **Borrowing is the everyday tool.** Moving a value into every function
  that reads it would be clumsy. Most functions *borrow*, `&players`, and
  the caller keeps it. That's the next chapter.

## Try it

In a test, write `let mut players = vec!["ann".to_string()]; let game =
start_match(players); players.push("sub".to_string());` and run
`cargo test`: E0382, pointing at the move and the use after. Take the
compiler's advice, `start_match(players.clone())`, and it compiles: the
match and your list are two values now.
