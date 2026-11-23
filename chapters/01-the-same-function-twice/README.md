# 1. The same function, twice

## Start from what you know

Here are three small JavaScript functions:

```js
// js/basics.js
export function fizzbuzz(n) {
  if (n % 15 === 0) return 'FizzBuzz'
  if (n % 3 === 0) return 'Fizz'
  if (n % 5 === 0) return 'Buzz'
  return String(n)
}

export function total(prices) {
  let sum = 0
  for (const price of prices) {
    sum += price
  }
  return sum
}

export function initials(name) {
  return name
    .split(' ')
    .filter((word) => word !== '')
    .map((word) => word[0].toUpperCase())
    .join('')
}
```

And here they are in Rust:

```rust
// rust/src/lib.rs
pub fn fizzbuzz(n: u32) -> String {
    if n % 15 == 0 {
        return "FizzBuzz".to_string();
    }
    if n % 3 == 0 {
        return "Fizz".to_string();
    }
    if n % 5 == 0 {
        return "Buzz".to_string();
    }
    n.to_string()
}

pub fn total(prices: &[f64]) -> f64 {
    let mut sum = 0.0;
    for price in prices {
        sum += price;
    }
    sum
}

pub fn initials(name: &str) -> String {
    name.split(' ')
        .filter(|word| !word.is_empty())
        .map(|word| word.chars().next().unwrap().to_uppercase().to_string())
        .collect()
}
```

The shape is the same: `if`, `for`, `split`, `filter`, `map`. Most of
what's new is small.

## Reading the Rust

- **`pub fn`** is `export function`. `pub` means other code may use it.
- **`n: u32`** says what kind of value `n` is: a *type*. `u32` is a
  whole number that can't be negative. `f64` is JavaScript's ordinary
  number. `&str` is some text. `&[f64]` is a list of numbers to read.
  JavaScript never asks you to write these. Chapter 2 is about why Rust
  does.
- **`-> String`** says what the function gives back.
- **`let mut sum`**: `let` as in JavaScript, and `mut` because `sum`
  changes. In Rust a variable can't change unless it says `mut`
  (chapter 3).
- **No `return` on the last line.** A function gives back its last
  expression, the one with no `;` after it: `n.to_string()`, `sum`.
- **`|word| ...`** is an arrow function, `(word) => ...`.
- **`;` matters.** It ends a statement. Leaving it off the last line is
  what makes that line the result.

## What rust-js writes

rust-js compiles the Rust to JavaScript. Here's what it wrote for
`fizzbuzz` and `total`, word for word:

```js
// rust/src/lib.js (generated)
export function fizzbuzz(n) {
  if (n % 15 === 0) {
    return "FizzBuzz";
  }
  if (n % 3 === 0) {
    return "Fizz";
  }
  if (n % 5 === 0) {
    return "Buzz";
  }
  return String(n);
}

export function total(prices) {
  let sum = 0;
  for (let i = 0; i < prices.length; i++) {
    const price = prices[i];
    sum += price;
  }
  return sum;
}
```

It's the JavaScript you'd have written. Your JavaScript imports it like
any module:

```js
import { fizzbuzz } from './rust/src/lib.js'
fizzbuzz(15) // "FizzBuzz"
```

## Side by side

`bun chapters/01-the-same-function-twice/compare.js` runs both:

```
fizzbuzz(15)                   js: FizzBuzz   rust: FizzBuzz
total([0.1, 0.2])              js: 0.30000000000000004  rust: 0.30000000000000004
initials("ada lovelace")       js: "AL"       rust: "AL"
initials("😀 smile")           js: "\ud83dS"  rust: "😀S"
```

Even `0.1 + 0.2` agrees: Rust's `f64` is the same kind of number as
JavaScript's.

The last line doesn't agree. In JavaScript, `word[0]` is the first
*UTF-16 unit* of the string, and an emoji is two of them, so the
JavaScript takes half an emoji. Rust's `word.chars().next()` takes the
first *character*, the whole emoji. Chapter 5 is about text.

`compare.test.js` checks both against what native Rust gives, case by
case, and pins the emoji difference.

## Try it

Call `fizzbuzz` with a string. In JavaScript:

```js
fizzbuzz('15')     // "FizzBuzz": '15' % 15 turns the string into a number
fizzbuzz('hello')  // "hello": NaN % 15 isn't 0, so String('hello')
fizzbuzz(7.5)      // "7.5"
```

Each runs, and each answers something. Now write `fizzbuzz("15")` in a
Rust test and run `cargo test`:

```
error[E0308]: mismatched types
  |             -------- ^^^^ expected `u32`, found `&str`
```

The program doesn't run at all. Rust checked the call against `n: u32`
before running anything. That check is what the next chapter is about.
