# 6. Everything is an expression

## Statements and expressions

JavaScript has two kinds of code. An *expression* gives a value: `2 + 3`,
`name.toUpperCase()`, `score >= 90 ? 'A' : 'B'`. A *statement* does
something and gives nothing: `if`, `for`, `switch`, `let`. You can't
write `const cents = if (...) {...}`, so a value that depends on a
decision is declared first and assigned in each branch:

```js
// js/expressions.js
export function shipping(totalCents) {
  let cents
  if (totalCents >= 5000) {
    cents = 0
  } else if (totalCents >= 2000) {
    cents = 500
  } else {
    cents = 1000
  }
  return cents
}
```

Miss a branch and `cents` is `undefined`. JavaScript's answer is the
ternary, `a ? b : c`, which is an expression but gets hard to read past
two choices.

## In Rust, `if` gives a value

Almost everything in Rust is an expression, `if` included:

```rust
// rust/src/lib.rs
pub fn shipping(total_cents: u32) -> u32 {
    if total_cents >= 5000 {
        0
    } else if total_cents >= 2000 {
        500
    } else {
        1000
    }
}
```

The `if` is the function's last expression, so it's what the function
gives back (chapter 1). No variable declared and assigned later, and no
branch can be missed: an `if` used as a value must have an `else`.

```rust
let cents: u32 = if total > 5 { 0 };
```

```
error[E0317]: `if` may be missing an `else` clause
```

A *block*, `{ ... }`, is an expression too: its value is its last line.
`let area = { let w = 3; let h = 4; w * h };` sets `area` to 12, and `w`
and `h` are gone after it.

## `match`: a `switch` that gives a value and never falls through

JavaScript's `switch` runs from the matching `case` *downward* until it
meets a `break`. Forget one, and the next case runs too:

```js
switch (day) {
  case 'fri':
    kind = 'almost weekend'
  // a `break` forgotten here: friday falls through
  case 'mon':
  // ...
    kind = 'weekday'
    break
```

```
dayKind("fri")         js: weekday         rust: almost weekend
```

Rust's `match` compares a value against *patterns*, top to bottom, and
runs exactly one arm. Each arm is an expression, and the `match` is one
too:

```rust
pub fn day_kind(day: &str) -> &'static str {
    match day {
        "sat" | "sun" => "weekend",
        "fri" => "almost weekend",
        "mon" | "tue" | "wed" | "thu" => "weekday",
        _ => "not a day",
    }
}
```

`|` means "or", and `_` matches anything left. And a `match` must cover
every value the type can have. Remove the `_` arm, and:

```
error[E0004]: non-exhaustive patterns: `&_` not covered
```

The compiler noticed that a string could be something else, such as
`"holiday"`. Patterns can be ranges too:

```rust
pub fn grade(score: u32) -> char {
    match score {
        90.. => 'A',
        80..=89 => 'B',
        70..=79 => 'C',
        _ => 'F',
    }
}
```

`80..=89` is 80 to 89 inclusive, and `90..` is 90 and up. Chapter 17
shows how much more patterns can do.

## A loop can give a value too

```rust
pub fn steps_to_one(start: u64) -> u32 {
    let mut n = start;
    let mut steps = 0;
    loop {
        if n == 1 {
            break steps;
        }
        n = if n % 2 == 0 { n / 2 } else { 3 * n + 1 };
        steps += 1;
    }
}
```

`loop` repeats forever, until a `break`, and `break steps` leaves the
loop and makes `steps` the loop's value. Here that value is the
function's result.

## What rust-js writes

rust-js turns the expressions back into the JavaScript you'd choose: the
three-way `if` into a ternary, and the `match` on strings into a
`switch` where every case `return`s, so nothing can fall through:

```js
// rust/src/lib.js (generated)
export function shipping(totalCents) {
  return totalCents >= 5000 ? 0 : totalCents >= 2000 ? 500 : 1000;
}

export function dayKind(day) {
  switch (day) {
    case "sat":
    case "sun":
      return "weekend";
    case "fri":
      return "almost weekend";
    // ...
    default:
      return "not a day";
  }
}
```

## Where it's different

- **The semicolon decides.** `n + 1` is a value; `n + 1;` is a statement
  that throws the value away. A function whose last line ends in `;`
  gives back nothing, `()`, and the compiler says so if a value was
  expected.
- **`return` still exists.** Use it to leave early, as `steps_to_one`
  could. For the last value, Rust style leaves it off.

## Try it

Delete the `_ => "not a day",` arm from `day_kind` and run `cargo build`:
E0004, the compiler listing what's not covered. Then delete a `break` from
a `switch` in `js/expressions.js` and run `bun test`: it runs, and the
answers are wrong.
