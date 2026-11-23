# 21. npm is cargo

## The words

| JavaScript | Rust |
|---|---|
| a package, `package.json` | a *crate*, `Cargo.toml` |
| npm, the registry | crates.io |
| `bun add heck` | `heck = "=0.5.0"` under `[dependencies]` |
| `bun.lock` | `Cargo.lock` |
| a file is a module | a module is declared, `mod posts;` |
| `export` | `pub` |
| `import { x } from './posts.js'` | `use crate::posts::x;` |
| `export { x } from './posts.js'` | `pub use posts::x;` |

Most of it maps one to one. Two things don't: a file isn't a module until
its parent says so, and Rust has a level of privacy JavaScript doesn't.

## `mod`: the module tree is written down

In JavaScript, every file is a module, found when something imports it.
A Rust crate starts from one file, `src/lib.rs`, which declares the
others:

```rust
// rust/src/lib.rs
mod text;        // src/text.rs, private
pub mod posts;   // src/posts.rs, public

pub use posts::Post;
```

A file nothing declares with `mod` isn't part of the crate at all, even
if it's sitting in `src/`. Inside a module, `use` imports:

```rust
// rust/src/posts.rs
use crate::text::{kebab, words};   // crate:: is this crate's root
```

## Three levels of "who can see this"

Everything in Rust is private unless it says otherwise, as a JavaScript
file's unexported names are. Rust adds a middle level:

| | JavaScript | Rust |
|---|---|---|
| this file only | not exported | private (the default) |
| this package only | *no such thing* | `pub(crate)` |
| anyone | `export` | `pub` |

`text.rs`'s helpers are `pub(crate)`: `posts.rs` uses them, and no user of
the crate can. In JavaScript, `text.js` must `export` `kebab` for
`posts.js` to use it, and then anyone can import it, past your
`index.js`, straight from the file. Rust's module privacy holds that line:
`text` is a private module, so outside the crate,
`chapter_21_npm_is_cargo::text::words` isn't a path you can write
(E0603, held by a doc test in `lib.rs` that must fail to compile).

## `pub use`: the front door

```rust
pub use posts::Post;
```

re-exports `Post` at the crate's root, as an `index.js` re-exports what a
package offers. Users write `chapter_21_npm_is_cargo::Post`, and the
crate can move `Post` to another module later without breaking them.
Delete the `pub use`, and the code that imported `Post` from the root
breaks:

```
error[E0432]: unresolved import `chapter_21_npm_is_cargo::Post`
```

## A crate from crates.io

```toml
# rust/Cargo.toml
[dependencies]
heck = "=0.5.0"
```

Cargo downloads it, builds it, and records the exact version in
`Cargo.lock`, as `bun add` does with `bun.lock`. `heck` converts names
between cases; bringing its trait in scope, `use heck::ToKebabCase`, gives
every string a `.to_kebab_case()` (chapter 15: a crate can add a trait to
a type it didn't write).

## What rust-js writes

Each module is its own JavaScript file, and a `use` is an `import`. The
crates.io crate is compiled to JavaScript too, into `rust-js/crates/` at
the root of this repository, and committed:

```js
// rust/src/text.js (generated)
import { strToKebabCase } from "../../../../rust-js/crates/heck-0.5.0/src/kebab.js";

export function kebab(title) {
  return strToKebabCase.toKebabCase(title);
}
```

`pub(crate)` functions are JavaScript like any other, since `posts.js`
imports them, but `text.js` gets no `.d.ts`: the declarations describe the
crate's public API alone. And the root re-exports `Post` for TypeScript
and your editor:

```ts
// rust/src/lib.d.ts (generated)
export type { Post } from "./posts.js";
```

## Side by side

```
js:   ["/rust-for-java-script (3 min)","/hello-world (1 min)","/xml-http-request-tips (1 min)"]
rust: ["/rust-for-java-script (3 min)","/hello-world (1 min)","/xml-http-request-tips (1 min)"]
```

Both see "JavaScript" as two words, "Java" and "Script".

## Where it's different

- **A crate compiles as a whole.** Big projects split into several crates
  in a *workspace*, as this repository is: one crate per chapter.
- **Features.** A crate can offer optional parts you switch on in
  `Cargo.toml`, `serde = { features = ["derive"] }`. npm has no direct
  equivalent.
- **One crate, many versions.** Like npm, Cargo builds two incompatible
  versions of a crate side by side when two dependencies need them, and
  merges compatible ones into one.

## Try it

Delete `pub use posts::Post;` from `lib.rs` and run `cargo test`:
`native.rs`, which imports `Post` from the root, gets E0432. `posts.rs`
still compiles, since it reaches `Post` from inside. The front door was
the only way in from outside.
