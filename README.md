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
