# coming-from-javascript

You know JavaScript. This is Rust, taught from there, and compiled back to
JavaScript with [rust-js](https://github.com/rust-js-lang/rust-js), so
what you write still runs where your JavaScript does: in the browser, in
Node, in bun.

Each chapter takes one idea, writes it in JavaScript and in Rust, compiles
the Rust to JavaScript, and runs both on the same inputs, so you can see
where they agree and where they don't. Native Rust runs the same inputs
too: the JavaScript rust-js writes must say what native Rust says.

This guide assumes JavaScript, not TypeScript. Types are new here, and
the early chapters introduce them from scratch: what a type is, why a
compiler checks one before the program runs, and what that buys you. If
you already write TypeScript,
[coming-from-typescript](https://github.com/rust-js-lang/coming-from-typescript)
starts further along.

## Chapters

Chapters are listed here as they're written.

1. [The same function, twice](chapters/01-the-same-function-twice/README.md):
   three JavaScript functions and their Rust, how to read the Rust, and the
   JavaScript rust-js writes, which reads like yours.
2. [Types are checked before it runs](chapters/02-types-are-checked-before-it-runs/README.md):
   what a type is, the typo and the `"2" + 1` the compiler stops before
   anything runs, `parse` as a step you write, and inference.
3. [`let`, `const` and `mut`](chapters/03-let-const-and-mut/README.md):
   nothing changes unless it says `mut`, contents included, and a function
   that changes its argument says `&mut` where it's written and called.
4. [Numbers](chapters/04-numbers/README.md): one JavaScript `number`
   becomes a kind for each job, whole numbers that divide whole, `as` for
   every change of kind, overflow you decide on, and `u64` as a `bigint`.
5. [Strings are UTF-8](chapters/05-strings-are-utf-8/README.md): why
   `length` counts an emoji twice and `slice` cuts it in half, `chars()`
   for characters, and `String` and `&str`.
6. [Everything is an expression](chapters/06-everything-is-an-expression/README.md):
   `if`, blocks and `loop` that give values, and `match`, a `switch` that
   must cover every case and never falls through.
7. [Objects are structs](chapters/07-objects-are-structs/README.md): a
   struct names its fields once, methods take `self` as a parameter, and
   a typo'd field or a lost `this` can't happen.
8. [Equality](chapters/08-equality/README.md): `==` that compares
   what's inside, never values of two types, `includes` and "unique" that
   work on objects, and an order a type derives.
9. [String flags are enums](chapters/09-string-flags-are-enums/README.md):
   a state as an enum whose variants carry their own data, a typo that
   doesn't compile, and a `match` that must handle every state.
10. [`null` and `undefined` are `Option`](chapters/10-null-and-undefined-are-option/README.md):
    a type for "may be missing", `unwrap_or` that keeps a 0 where `||`
    doesn't, and `?` for giving up early.
11. [`try`/`catch` is `Result`](chapters/11-try-catch-is-result/README.md):
    failure in the return type, an error enum naming every way, `?` to
    pass it on, and panics kept for bugs.
12. [Arrays and iterators](chapters/12-arrays-and-iterators/README.md):
    a `Vec` owns and a slice borrows, so a function that reads can't sort
    your array; lazy iterators, and `Option`s where JavaScript gives
    `-Infinity` and `undefined`.
13. [`Map`, `Set`, and objects as maps](chapters/13-map-set-and-objects-as-maps/README.md):
    the word "constructor" a plain object can't count, `HashMap` and
    `HashSet` with one key type, `entry`, and order you ask for.
14. [Functions and closures](chapters/14-functions-and-closures/README.md):
    closures that copy a loop's `i` where `var` shares one, `move`, and
    `Fn` and `FnMut` saying what a closure does to what it holds.
15. [Duck typing is traits](chapters/15-duck-typing-is-traits/README.md):
    a trait lists what a type can do and an `impl` must have it all, so a
    misspelled `send` is caught before a broadcast half-sends; `impl` and
    `dyn`.
16. [Generics](chapters/16-generics/README.md): one function for many
    types with a bound that says what a `T` can do, where JavaScript's
    `largest` answers for objects anyway; generic structs.
17. [Pattern matching](chapters/17-pattern-matching/README.md): a URL
    router by the shape of its parts, slice patterns, `..`, `@`, guards
    and `let else`, where JavaScript's makes a page for user NaN.
18. [Moves](chapters/18-moves/README.md): one owner, so a match's
    players can't be changed behind its back; `clone` and `Copy`, and
    what JavaScript callers should know today.

## Running it

You need [bun](https://bun.sh) and [Rust](https://rustup.rs). The
toolchain is pinned in `rust-toolchain.toml`, and rustup fetches it.

```
git clone --recurse-submodules https://github.com/rust-js-lang/coming-from-javascript
cd coming-from-javascript
bun install
bun run rust     # compile every chapter's Rust to JavaScript with rust-js
bun run test     # each chapter's tests, then native Rust's
```

To run one chapter's comparison: `bun chapters/01-the-same-function-twice/compare.js`.

## The layout

```
coming-from-javascript/
├── vendor/rust-js/              the compiler, a submodule pinned to a commit
├── chapters/01-the-same-function-twice/
│   ├── js/stats.js              the JavaScript
│   ├── rust/src/lib.rs          the Rust
│   ├── rust/src/lib.js          what rust-js writes from it (committed)
│   ├── rust/tests/native.rs     native Rust on the same cases
│   ├── cases.json               the inputs, and what each should give
│   └── compare.js, .test.js     both, side by side
├── scripts/patch-rust-js.ts     applies patches/, while any wait upstream
└── PATCHES.md                   what's patched, and why
```

rust-js also writes a `.d.ts` beside each `lib.js`, TypeScript's
description of it. It's committed too, and your editor reads it to
autocomplete the Rust's functions from JavaScript.

## Found a problem?

If a chapter says something rust-js doesn't do, or does differently, open
an issue on [rust-js](https://github.com/rust-js-lang/rust-js/issues) or
here.
