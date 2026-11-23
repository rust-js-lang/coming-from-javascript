# 23. Testing

## Tests in JavaScript

You pick a runner (bun's, vitest, jest, Node's), install it, and keep
tests in files of their own:

```js
// js/password.test.js
import { expect, test } from 'bun:test'
import { strength } from './password.js'

test('a long mixed password is strong', () => {
  expect(strength('Correct-Horse-9')).toBe('strong')
})
```

A test file is a module like any other, so it can only reach what
`password.js` exports. A helper you'd like to test on its own, such as
`kinds`, must be exported just for the tests, or tested only through
`strength`.

## Tests in Rust: built in

Rust's test runner comes with the language. A test is a function marked
`#[test]`, and `cargo test` finds and runs them all. Nothing to install,
nothing to configure.

### Unit tests live beside the code

```rust
// rust/src/lib.rs
fn kinds(password: &str) -> u32 { /* ... */ }   // private

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn a_long_mixed_password_is_strong() {
        assert_eq!(strength("Correct-Horse-9"), "strong");
    }

    #[test]
    fn a_private_helper_is_tested_from_its_own_file() {
        assert_eq!(kinds("aB3$"), 4);
    }
}
```

- **`#[cfg(test)]`** compiles the module only for `cargo test`. It isn't
  in the real build at all.
- **`use super::*`** brings in everything from the file, private items
  too. A child module sees its parent's privates, so `kinds` can be tested
  without being made public.

### The assertions

| bun / jest | Rust |
|---|---|
| `expect(a).toBe(b)`, `.toEqual(b)` | `assert_eq!(a, b)` (compares with `==`, chapter 8) |
| `expect(a).not.toBe(b)` | `assert_ne!(a, b)` |
| `expect(ok).toBe(true)` | `assert!(ok)`, or `assert!(ok, "why {x}")` |
| `expect(() => f()).toThrow('x')` | `#[should_panic(expected = "x")]` on the test |
| `test.skip` | `#[ignore]` |
| an async test that rejects | a test that returns `Result`, failing on `Err` |

A test can return a `Result`, so `?` works inside it, and a test can
require a panic, for the bugs that should crash (chapter 11):

```rust
#[test]
#[should_panic(expected = "no scores")]
fn averaging_nothing_panics() {
    average(&[]);
}
```

In JavaScript, the average of no scores is `NaN`, quietly.

A failed `assert_eq!` shows both sides:

```
assertion `left == right` failed
  left: "strong"
 right: "okay"
```

### Integration tests see what users see

Files in `tests/` are *integration tests*. Each is a crate of its own that
uses the library through its public API alone. Every chapter's
`rust/tests/native.rs` is one.

### Doc tests

A code block in a `///` comment is compiled and run, so examples in the
docs can't go stale. Chapter 21's private-module check is one, a block
that must *fail* to compile.

## What rust-js writes: the same tests, as JavaScript

`rust-js test` compiles a crate's tests into JavaScript test files and
runs them with the runner the crate names:

```toml
# rust/Cargo.toml
[package.metadata.rust-js.test]
runner = "bun"
```

```
$ bun vendor/rust-js/tooling/cli.js test --package chapter-23-testing
bun test v1.4.4

 6 pass
 0 fail
```

That's the five unit tests from `lib.rs`, private helper and
`should_panic` included, and the integration test `native.rs`, run as
JavaScript. Each `#[test]` becomes a `test(..)` of `bun:test`, and a
failure reads the same:

```
error: assertion `left == right` failed
  left: "strong"
 right: "okay"
```

`bun run test` runs this too, after `cargo test`, so the chapter's Rust
tests pass natively *and* as the JavaScript you ship.

## Where it's different

- **No mocking library.** Rust has no monkey-patching: you can't replace
  a function at run time. Code that needs a fake takes it as a parameter,
  a trait (chapter 15) with a real `impl` and a test one.
- **Tests run in parallel by default**, each on its own thread.
- **Snapshots and property tests are crates**: `insta` for snapshots,
  `proptest` for properties, as `fast-check` is for JavaScript.

## Try it

In `lib.rs`'s `a_long_mixed_password_is_strong`, change `"strong"` to
`"okay"`. Run `cargo test -p chapter-23-testing`, then `bun
vendor/rust-js/tooling/cli.js test --package chapter-23-testing`. Both
fail the same test, with the same `left` and `right`.
