# 10. `null` and `undefined` are `Option`

## Two kinds of nothing, everywhere

In JavaScript, any value might be missing. A property that isn't there
is `undefined`, so is a function's missing argument and the result of
`find` that found nothing, and some APIs use `null` instead. Using a
missing value is the most common JavaScript error there is: `Cannot read
properties of undefined`.

Modern JavaScript has good tools for it, `?.` and `??`. They only work
where you remember to use them, and the older tool, `||`, has a trap:

```js
// js/profiles.js
export const volume = (profile) => profile.volume || 50
```

`||` replaces every *falsy* value, and `0` is falsy. A user who muted
their volume, `volume: 0`, gets 50:

```
Ada
  volume          js (||): 50   js (??): 0    rust: 0
```

## Rust has no `null`

In Rust, a value of type `String` is always a string and a `u32` is
always a number. A value that may be missing has its own type,
`Option`, an enum (chapter 9) with two variants:

```rust
enum Option<T> {
    Some(T),   // here it is
    None,      // there's nothing
}
```

`T` stands for any type: `Option<String>` is maybe a string,
`Option<u32>` maybe a number. The profile says which fields may be
missing:

```rust
// rust/src/lib.rs
pub struct Profile {
    pub name: String,
    pub nickname: Option<String>,
    pub volume: Option<u32>,
    pub manager_name: Option<String>,
}
```

An `Option<u32>` isn't a number, so you can't use it as one by
accident:

```rust
let v: u32 = p.volume + 1;
```

```
error[E0369]: cannot add `{integer}` to `Option<u32>`
```

You have to say what happens when it's `None`. The usual ways:

| You want | JavaScript | Rust |
|---|---|---|
| a default | `x ?? 50` | `x.unwrap_or(50)` |
| to change it if it's there | `x === undefined ? undefined : f(x)` | `x.map(f)` |
| to give up if it's missing | `x?.y` | `let x = x?;` |
| to do something if it's there | `if (x !== undefined) { … }` | `if let Some(x) = x { … }` |
| "I know it's there" | `x!` (TypeScript), or nothing | `x.unwrap()`: panics if it isn't |

`unwrap_or` replaces `None` and nothing else, so `Some(0)` stays 0:

```rust
pub fn volume(profile: &Profile) -> u32 {
    profile.volume.unwrap_or(50)
}
```

## `?` gives up early

```rust
pub fn managers_name(profiles: &[Profile], name: &str) -> Option<String> {
    let person = find(profiles, name)?;
    let manager = find(profiles, person.manager_name.as_deref()?)?;
    Some(display_name(manager).to_string())
}
```

`?` after an `Option` means: if it's `None`, return `None` from this
function now; otherwise, here's what's inside. Three things can be
missing (the person, their manager's name, the manager), and the code
reads as if none could. It's `?.` for a whole function.

## What rust-js writes

`Some(x)` is just `x`, and `None` is `undefined`, so the JavaScript is
what you'd write, with the right operator:

```js
// rust/src/lib.js (generated)
export function volume(profile) {
  return profile.volume ?? 50;
}

export function managersName(profiles, name) {
  const person = find(profiles, name);
  if (person == null) {
    return;
  }
  // ...
}
```

rust-js wrote `??`, never `||`: it can't confuse "missing" with "zero",
because the types never did. From JavaScript, either `undefined` or
`null` counts as `None`, and an `Option` field is optional: `{ name:
'Ada' }` is a whole profile.

## Where it's different

- **One nothing, not two.** Rust has no difference between "not set"
  (`undefined`) and "set to nothing" (`null`). When you need both, it's
  `Option<Option<T>>`, and that's rare.
- **`unwrap()` is a choice you can see.** `x.unwrap()` says "I'm sure
  it's there", and panics at that line if you're wrong. A code review can
  search for every one of them.

## Try it

In a test, write `let v: u32 = p.volume + 1;` for a profile `p`, and run
`cargo test`: E0369, an `Option<u32>` isn't a number. Change it to
`p.volume.unwrap_or(50) + 1` and it compiles. Then in JavaScript, try
`({ volume: 0 }).volume || 50`: 50.
