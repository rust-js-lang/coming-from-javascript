# 2. Types are checked before it runs

## JavaScript has types too

Every JavaScript value has a type: `typeof 2` is `"number"`, `typeof
"2"` is `"string"`. A type says two things, what values it holds and what
you can do with them: you can multiply numbers and uppercase strings.

What JavaScript doesn't do is *check* types until the moment a line runs.
And when the check fails, it often doesn't stop. It makes something up:

```js
// js/cart.js
export function greetMistyped(user) {
  return `Hello, ${user.nmae}!`   // typo: there's no `nmae`
}

export function nextQuantity(current) {
  return current + 1               // a form's input value is a string
}
```

```
greetMistyped(ada)       js: Hello, undefined!
nextQuantity('2')        js: "21"
```

A typo gives `undefined`, printed into the page. A number read from a
form is really a string, so `+ 1` joins instead of adding, and the cart
says 21. Neither line threw. You find these by testing every path, or
from a user.

## Rust checks before it runs

In Rust, every value's type is known *before the program runs*. The
compiler checks every use of every value against its type, and a program
with a mismatch doesn't compile, so it never runs at all.

```rust
// rust/src/lib.rs
pub struct User {
    pub name: String,
    pub age: u32,
}

pub fn greet(user: &User) -> String {
    format!("Hello, {}!", user.name)
}

pub fn next_quantity(current: u32) -> u32 {
    current + 1
}
```

`struct User` lists the fields a user has, and the type of each
(chapter 7 is about structs). Write `user.nmae` and:

```
error[E0609]: no field `nmae` on type `User`
help: a field with a similar name exists
```

Call `next_quantity("2")`, with text, and:

```
error[E0308]: mismatched types
expected `u32`, found `&str`
```

Each bug is found where it's written, by the compiler, in every path:
the one your tests run and the one they don't.

## Turning text into a number is a step you write

If `+` can't turn a string into a number, how does a form's `"2"` become
`2`? You say so, with `parse`:

```rust
pub fn parse_quantity(text: &str) -> u32 {
    text.trim().parse().unwrap_or(0)
}
```

`parse` is strict. The whole text must be a whole number that fits a
`u32`, or it's an error, and `unwrap_or(0)` makes an error `0` (chapter
11 is about errors). JavaScript's `parseInt` takes whatever digits it
finds first:

```
parseQuantity("7")        js: 7      rust: 7
parseQuantity("2.5")      js: 2      rust: 0
parseQuantity("12abc")    js: 12     rust: 0
```

## You write fewer types than you'd think

Rust *infers* most types. `let mut sum = 0.0;` is an `f64` because
`0.0` is. `let name = String::from("Ada");` is a `String`. You write
types in three places:
- **function signatures**, its parameters and its result;
- **struct fields**;
- the rare spot where the compiler can't tell, such as `"7".parse::<u32>()`.

A signature is a promise both ways. The function's body may rely on
`current` being a `u32`, and every caller must give one. So you can read
what a function needs and gives from its first line, without reading its
body, and the compiler holds everyone to it.

## What rust-js writes

Types are gone by the time anything runs. They were for the compiler's
checks, and the JavaScript has none:

```js
// rust/src/lib.js (generated)
export function greet(user) {
  return `Hello, ${user.name}!`;
}

export function nextQuantity(current) {
  return (current + 1) >>> 0;
}
```

(`>>> 0` keeps the result a `u32`: chapter 4.) rust-js also writes the
types down for JavaScript's tools, in `lib.d.ts`:

```ts
// rust/src/lib.d.ts (generated)
export function nextQuantity(current: number): number;
```

Your editor reads it, so in plain JavaScript it autocompletes the Rust's
functions and shows what each takes.

### From JavaScript, today

The compiler checks Rust code that calls `next_quantity`. JavaScript that
calls it isn't checked yet: `nextQuantity('2')` from JavaScript runs
`('2' + 1) >>> 0`, which is `21`. rust-js is adding checks at the
boundary, where JavaScript hands Rust a value, so that this throws
instead ([rust-js#2403](https://github.com/rust-js-lang/rust-js/issues/2403)).
Until it lands, `compare.test.js` pins what happens today.

## Try it

In a test, write `let u = User { name: "Ada".into(), age: 36 };` and use
`u.nmae`. Run `cargo test`: E0609, and the compiler suggests `name`. Then
open `js/cart.js` and make the same typo: it runs, and prints
`Hello, undefined!`.
