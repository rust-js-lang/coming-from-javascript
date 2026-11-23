# 3. `let`, `const` and `mut`

## What JavaScript's `const` promises

You know the rule: use `const` unless you need to reassign, then `let`.
But `const` only promises that the *name* keeps pointing at the same
thing. The thing itself can still change:

```js
const settings = { theme: 'dark', fontSize: 14 }
enlarge(settings)        // settings.fontSize is now 16
const tags = []
tags.push('allowed')     // fine
```

And nothing at the call `enlarge(settings)` tells you that `enlarge`
changes what you gave it. You read the function to find out:

```js
// js/settings.js
export function enlarge(settings) {
  settings.fontSize += 2
}
```

## Rust: nothing changes unless it says `mut`

In Rust, a `let` variable can't change at all: not reassigned, and not
what's inside it either.

```rust
let count = 1;
count += 1;
```

```
error[E0384]: cannot assign twice to immutable variable `count`
```

A variable that changes says `mut`:

```rust
// rust/src/lib.rs
pub fn countdown(from: u32) -> Vec<u32> {
    let mut numbers = Vec::new();
    let mut n = from;
    while n > 0 {
        numbers.push(n);
        n -= 1;
    }
    numbers
}
```

`numbers.push(n)` changes the list, so `numbers` is `let mut`, just as
`n -= 1` needs `n` to be. Read the other way: a variable *without* `mut`
holds the same value for the whole function, contents included. When you
read `let settings = ...`, you know nothing changes it.

## A function that changes its argument says so, at both ends

In Rust, `enlarge` must say it changes the settings it's given, with
`&mut`:

```rust
pub fn enlarge(settings: &mut Settings) {
    settings.font_size += 2;
}
```

and so must every call:

```rust
let mut settings = Settings { theme: "dark".to_string(), font_size: 14 };
enlarge(&mut settings);
```

Leave out either `mut`, and it doesn't compile:

```
error[E0596]: cannot borrow `settings` as mutable, as it is not declared as mutable
```

```
error[E0308]: mismatched types
   ... types differ in mutability
```

The second is `enlarge(&settings)`, without `mut`. So when you read
`enlarge(&mut settings)`, the call itself tells you `settings` may come
back changed. A function that only reads takes `&Settings`, and can't
change them, as `bigger` does: it returns new settings and leaves yours
alone. (The `&` is *borrowing*, lending a value without giving it away.
Chapter 19 is about it.)

## Shadowing: a new `let` with the same name

Sometimes a value goes through steps. JavaScript reassigns one `let`:

```js
let slug = title.trim()
slug = slug.toLowerCase()
```

Rust lets you declare the name again, and each `let` is a new variable
that *shadows* the one before:

```rust
let slug = title.trim();
let slug = slug.to_lowercase();
let slug: Vec<&str> = slug.split_whitespace().collect();
slug.join("-")
```

Nothing was changed, so no `mut`, and each step can even be a different
type: text, then a list of words.

## And `const`?

Rust has `const` too, and it means something stronger: a value fixed when
the program is *compiled*, the same everywhere, like a JavaScript
`const` of a plain number at the top of a module:

```rust
pub const MAX_TAGS: usize = 3;
```

## What rust-js writes

The `mut`s are gone from the JavaScript. They were checks, and the
checks were done:

```js
// rust/src/lib.js (generated)
export const MAX_TAGS = 3;

export function slugify(title) {
  let slug = $trim(title);
  slug = $toLowercase(slug);
  slug = $splitWhitespace(slug);
  return slug.join("-");
}

export function countdown(from) {
  const numbers = [];
  for (let n = from; n > 0; n--) {
    numbers.push(n);
  }
  return numbers;
}
```

The three `let slug`s became one JavaScript `let`, reassigned, and the
`while` loop became the `for` you'd write. rust-js's `.d.ts` keeps one
trace of the rule: `addTag(tags: string[], ...)`, where a function that
only reads a list is declared `readonly string[]`.

## Where it's different

- **Mutability belongs to the variable, not the value.** The same
  settings can be read through `let s` and changed through `let mut s`.
  JavaScript's `Object.freeze` freezes the object instead, and only one
  level deep.
- **The compiler notices a `mut` you don't need.** Write `let mut x` and
  never change `x`, and you get a warning: `variable does not need to be
  mutable`.

## Try it

In a test, write `let settings = Settings { theme: "dark".to_string(),
font_size: 14 };` and then `enlarge(&mut settings);`. Run `cargo test`:
E0596, "not declared as mutable". Add `mut` to the `let`, and it
compiles. The call `enlarge(&mut settings)` now tells every reader that
`settings` changes.
