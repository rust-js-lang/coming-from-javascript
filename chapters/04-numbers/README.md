# 4. Numbers

## JavaScript has one number

Every JavaScript `number` is the same kind: a 64-bit floating-point
number. It holds fractions, and it holds whole numbers exactly up to
2<sup>53</sup>, about 9 quadrillion. That's simple, and it leaks:

- **Whole-number arithmetic needs help.** `1000 / 3` is `333.333…`, so
  splitting a bill takes `Math.floor`.
- **Big whole numbers silently round.** Past 2<sup>53</sup>, `id + 1`
  can't be represented, and it rounds back to `id`.
- **Nonsense keeps going.** `1000 / 0` is `Infinity`, `1000 % 0` is
  `NaN`, and both flow on into whatever reads them.

## Rust has a number for each job

| Kind | Holds | JavaScript |
|---|---|---|
| `u8`, `u16`, `u32`, `u64`, `u128` | whole numbers from 0, in 8 to 128 bits | `number`, or for 64 bits and more a `bigint` |
| `i8` … `i128` | whole numbers, negative too | the same |
| `usize` | a length or an index | `number` |
| `f32`, `f64` | fractions; `f64` is JavaScript's `number` | `number` |

You pick the kind that fits: `u8` for a game's lives (0 to 255), `u32`
for cents, `u64` for an id, `f64` for a score with fractions. The
compiler then holds every value to its kind:

```rust
let lives: u8 = 300;
```

```
error: literal out of range for `u8`
  = note: the literal `300` does not fit into the type `u8` whose range is `0..=255`
```

## Whole numbers divide whole

```rust
// rust/src/lib.rs
pub fn split_bill(total_cents: u32, people: u32) -> (u32, u32) {
    (total_cents / people, total_cents % people)
}
```

Dividing two `u32`s gives a `u32`: `1000 / 3` is `333`, and `1000 % 3`
is the `1` cent left over. No `Math.floor`. (`(u32, u32)` is a *tuple*,
two values together, an array of two in JavaScript.)

Dividing a whole number by zero is a bug, and Rust stops right there
with a *panic*, a crash with a message:

```
splitBill(1000, 0)          js: ["Infinity","NaN"]     rust: panics, attempt to divide by zero
```

## Changing kind is written down: `as`

Rust never mixes kinds silently. `sum / scores.len()` divides an `f64`
by a `usize`, which won't compile, so you write the conversion:

```rust
pub fn average(scores: &[f64]) -> f64 {
    let mut sum = 0.0;
    for score in scores {
        sum += score;
    }
    sum / scores.len() as f64
}

pub fn percent(part: u32, whole: u32) -> u32 {
    (part as f64 / whole as f64 * 100.0).round() as u32
}
```

`as` is a blunt tool: a fraction made whole drops what's after the
point, and a float too big for the whole kind becomes that kind's
largest. So `percent(1, 0)`, where `1 / 0` is infinity, is
`4294967295`, the largest `u32`, where JavaScript's is `Infinity`. Rust
has checked conversions for when that matters (chapter 11).

## When a number would overflow

A `u8` holds 0 to 255. What's `250 + 10`? You decide, by the method you
call:

```rust
pub fn add_lives(lives: u8, more: u8) -> u8 {
    lives.saturating_add(more)   // stops at 255
}
```

There's `checked_add` (an answer or "it doesn't fit"), `wrapping_add`
(around past 255 to 0) and `saturating_add` (stays at the top). Plain
`+` that overflows is a bug: a panic in a debug build, and it wraps
around in a release build, as it does in rust-js's JavaScript.

## What rust-js writes

Each kind is kept, with the least JavaScript that keeps it:

```js
// rust/src/lib.js (generated)
export function nextId(id) {
  return BigInt.asUintN(64, id + 1n);
}

export function addLives(lives, more) {
  return Math.min(lives + more, 255);
}
```

A `u64` is a JavaScript `bigint`, so every digit is kept:

```
nextId(9007199254740992)    js: 9007199254740992       rust: 9007199254740993n
```

The `.d.ts` says so (`nextId(id: bigint): bigint`), so you call it with
`9007199254740992n`. A `u32`'s sum gets a `>>> 0`, a whole-number
division a helper that panics on zero, and `saturating_add` on a `u8`
becomes the `Math.min` you'd write.

## Side by side

```
splitBill(1000, 3)          js: [333,1]                rust: [333,1]
nextId(9007199254740992)    js: 9007199254740992       rust: 9007199254740993n
addLives(250, 10)           js: 255                    rust: 255
percent(1, 0)               js: "Infinity"             rust: 4294967295
splitBill(1000, 0)          js: ["Infinity","NaN"]     rust: panics, attempt to divide by zero
```

## Where it's different

- **Floats are the same floats.** `0.1 + 0.2` is `0.30000000000000004`
  in both (chapter 1), and NaN is still NaN: the average of no scores is
  `NaN` both ways.
- **No automatic conversion, ever.** Not `u8` to `u32`, not `u32` to
  `f64`. That's more typing, and it means every conversion is one you
  chose.

## Try it

Write `let lives: u8 = 300;` in a test and run `cargo test`. The value
doesn't fit, and the compiler says so, with the range. Then try
`let lives: u8 = 250; let more: u8 = 10; let total = lives + more;`. The
compiler works out the sum and refuses that too: `this arithmetic
operation will overflow`. It can't know a value that arrives while the
program runs, though: give `add_lives`'s body a plain `lives + more`, call
it with 250 and 10 from a test, and the debug build panics with
`attempt to add with overflow`.
