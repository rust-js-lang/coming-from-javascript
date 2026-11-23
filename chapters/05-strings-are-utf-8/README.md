# 5. Strings are UTF-8

## What JavaScript's `length` counts

A JavaScript string is a list of *UTF-16 code units*. Most characters
are one unit. Many emoji, and some rarer scripts, are two. `length`,
`slice`, `[i]` and `split('')` all count units, not characters:

```js
// js/text.js
export const charCount = (text) => text.length
export const truncate = (text, max) => (text.length <= max ? text : text.slice(0, max) + '…')
export const reverse = (text) => text.split('').reverse().join('')
```

```
"😀👍 ok"
  characters    js: 7              rust: 5
  truncate 3    js: "😀\ud83d…"    rust: "😀👍 …"
  reverse       js: "ko \udc4d😀\ud83d" rust: "ko 👍😀"
```

Five characters, counted as seven. Truncating to three cuts 👍 in half,
leaving `\ud83d`, a broken half that displays as `�`. Reversing swaps
each emoji's two halves. Every one of these runs without an error.

## Rust: text is UTF-8, and characters are asked for

A Rust string is UTF-8 bytes, and always valid UTF-8: there's no way to
hold half a character. You can't index into one:

```rust
let first = word[0];
```

```
error[E0277]: the type `str` cannot be indexed by `{integer}`
    = note: you can use `.chars().nth()` or `.bytes().nth()`
```

Because "the 0th thing" could mean a byte or a character, Rust makes you
say which. `.chars()` walks whole characters:

```rust
// rust/src/lib.rs
pub fn char_count(text: &str) -> usize {
    text.chars().count()
}

pub fn truncate(text: &str, max: usize) -> String {
    if text.chars().count() <= max {
        return text.to_string();
    }
    let mut short: String = text.chars().take(max).collect();
    short.push('…');
    short
}

pub fn reverse(text: &str) -> String {
    text.chars().rev().collect()
}
```

And `.len()` is the number of *bytes*, which is what a file or a network
message needs to know: `"héllo".len()` is 6, as `é` takes two bytes.

You can slice by byte position, `&text[0..4]`, but only on a character's
edge. Slice into the middle of one and the program stops with a panic
that tells you exactly where:

```
end byte index 1 is not a char boundary; it is inside '😀' (bytes 0..4 of string)
```

It never quietly gives you half a character.

## `String` and `&str`

Rust has two string types, and you'll see both everywhere:

- **`String`** owns its text and can grow: `String::from("Hi")`,
  `push_str`, `push`, `format!`. A function that *makes* text returns a
  `String`.
- **`&str`** borrows text someone else owns: a string literal like
  `"hello"`, or part of a `String`. A function that only *reads* text
  takes a `&str`.

```rust
pub fn greet_all(names: &[&str]) -> String {
    let mut greeting = String::from("Hi");
    for (i, name) in names.iter().enumerate() {
        greeting.push_str(if i == 0 { " " } else if i == names.len() - 1 { " and " } else { ", " });
        greeting.push_str(name);
    }
    greeting.push('!');
    greeting
}
```

It reads the names, `&str`s, and builds a new `String`. In JavaScript
both are just strings, since a JavaScript string can't change anyway.
Chapter 18 explains owning and borrowing.

## What rust-js writes

Both are JavaScript strings. rust-js writes `.chars()` as `Array.from`,
which walks by whole characters, and `.len()` as a count of UTF-8 bytes:

```js
// rust/src/lib.js (generated)
export function charCount(text) {
  return Array.from(text).length;
}

export function byteSize(text) {
  return $byteLen(text);
}

export function reverse(text) {
  return Array.from(text).toReversed().join("");
}
```

`Array.from(text)` is also the fix in plain JavaScript. The difference
is that Rust gives you no way to forget it.

## Where it's different

- **A character isn't always a letter you see.** Rust's `char` is a
  Unicode *scalar value*. An `é` written as `e` plus a combining accent is
  two `char`s, and a family emoji 👨‍👩‍👧 is five. For what a reader sees as one
  letter (a *grapheme*), Rust has the `unicode-segmentation` crate, as
  JavaScript has `Intl.Segmenter`.
- **`+` on strings is picky.** `String + &str` works and gives a
  `String`; `&str + &str` doesn't compile. Most code uses `format!("{a}
  {b}")`, which is a template literal.
- **Upper case can grow.** Both languages agree that `"ß"` capitalized
  is `"SS"`, so `to_uppercase()` gives several characters, not one.

## Try it

In a test, write `let word = String::from("hello"); let first = word[0];`
and run `cargo test`: E0277, and the compiler suggests `.chars().nth()`.
Then in JavaScript, `"😀ok"[0]` gives `'\ud83d'`, half an emoji, with no
error at all.
