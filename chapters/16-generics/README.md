# 16. Generics

## JavaScript functions take anything

You've never written a type in JavaScript, so every function you've
written is "generic": it takes values of any type. `largest` works on
numbers and on words:

```js
// js/generic.js
export function largest(items) {
  if (items.length === 0) return undefined
  let best = items[0]
  for (const item of items) if (item > best) best = item
  return best
}
```

It also takes things it can't handle, and answers anyway:

```
largest([{price: 3}, {price: 9}])   js: {"price":3}
largest([2, "10"])                  js: "10"
```

Objects have no order, so `>` is always false and the first one "wins".
A list mixing numbers and strings compares however `>` happens to
convert them. No error, a wrong answer.

## Rust: one function for many types, with a bound

Since Rust checks types (chapter 2), a function written for `u32`s only
takes `u32`s. To write it once for many types, give it a *type
parameter*, `<T>`, a name that stands for whichever type the caller uses:

```rust
// rust/src/lib.rs
pub fn largest<T: PartialOrd>(items: &[T]) -> Option<&T> {
    let mut best = items.first()?;
    for item in items {
        if item > best {
            best = item;
        }
    }
    Some(best)
}
```

`T: PartialOrd` is a *bound*. It says a `T` must be comparable with `>`,
using the trait from chapter 8. The bound does two jobs:

- **The body may only do what the bound promises.** Without `PartialOrd`,
  the `>` doesn't compile:
  ```
  error[E0369]: binary operation `>` cannot be applied to type `&T`
  help: consider restricting type parameter `T` with trait `PartialOrd`
  ```
- **Every caller must meet it.** Prices that can't be compared are refused
  where `largest` is called:
  ```
  error[E0277]: can't compare `Price` with `Price`
  note: required by a bound in `chapter_16_generics::largest`
  ```

And a list mixing `2` and `"10"` can't exist at all: a `Vec<T>` holds one
type (E0308, mismatched types).

`largest(&[3, 9, 4])` and `largest(&words)` call the same function: the
compiler works out `T` from what you pass.

## Generic structs

A struct can take a type parameter too:

```rust
pub struct Stack<T> {
    pub items: Vec<T>,
}

impl<T: Clone> Stack<T> {
    pub fn push(&mut self, item: T) { .. }
    pub fn pop(&mut self) -> Option<T> { .. }
    pub fn peek(&self) -> Option<T> { .. }
}
```

`balanced` uses a `Stack<char>` to check brackets. A `Stack<char>` holds
only `char`s, so nothing else can be pushed onto it by mistake. You've
used generic types since chapter 10: `Option<T>`, `Vec<T>`, `HashMap<K,
V>` are all written this way.

## What rust-js writes

The type parameter is gone, as types always are in the JavaScript. The
bound stays, as a value: the comparison `T` was promised to have is passed
in as an extra argument:

```js
// rust/src/lib.js (generated)
export function largest(items, TPartialOrd) {
  // ...
      if (TPartialOrd.gt(item, best)) {
  // ...
}

export function highestScore(scores) {
  return largest(scores, $partiallyOrdered) ?? undefined;
}
```

Rust code passes that comparison without you seeing it. JavaScript
can't, so rust-js leaves `largest` out of the `.d.ts`, with a note saying
why. `highestScore` (`u32`s) and `lastWord` (`String`s) are what
JavaScript calls. A generic with no bound needs nothing passed, so
`Stack`'s functions are declared as they are: `push<T>(stack: Stack<T>,
item: T): void`.

## Where it's different

- **No "anything goes" type.** There's no `T` without rules: what a `T`
  can do is exactly what its bounds say.
- **The bounds are traits.** `PartialOrd` to compare, `Clone` to copy,
  `Display` to print with `{}`, `Notifier` from chapter 15: a generic
  function lists the traits it needs.

## Try it

Remove `PartialOrd` from `largest`, leaving `<T>`, and run `cargo build`:
E0369, and the compiler says which bound to add. Then in JavaScript, call
`largest` on a list of objects: it answers, with the first one.
