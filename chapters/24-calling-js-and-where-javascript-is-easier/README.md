# 24. Calling JavaScript, and where JavaScript is easier

The last chapter has two parts: how Rust uses the JavaScript you already
have, and an honest list of what JavaScript makes easier.

## Rust calls your JavaScript: a binding

Saying "23 hours ago" well, in every language, is hard. JavaScript's
`Intl.RelativeTimeFormat` already does it:

```js
// js/time.js
export function relativeTime(seconds) {
  const format = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  // ... days, hours, minutes
}
```

Rust *declares* the function, a *binding*, and then calls it like any
Rust function:

```rust
// rust/src/lib.rs
#[cfg_attr(rust_js, rust_js::link_name = "../../js/time.js#relativeTime")]
fn relative_time(seconds: u32) -> String {
    unreachable!("{seconds}: a binding runs only in JavaScript")
}

pub fn feed(events: &[Event], now: u32, keep: impl Fn(&Event) -> bool) -> Vec<String> {
    kept(events, keep)
        .iter()
        .map(|e| format!("{} {}, {}", e.who, e.did, relative_time(now - e.at)))
        .collect()
}
```

`link_name` says where it lives: the module before the `#`, the export
after it. rust-js turns it into an `import`:

```js
// rust/src/lib.js (generated)
import { relativeTime } from "../../js/time.js";

export function feed(events, now, keep) {
  return kept(events, keep).map((e) => `${e.who} ${e.did}, ${relativeTime((now - e.at) >>> 0)}`);
}
```

```
ada pushed a fix, 23 hours ago
grace merged it, 2 hours ago
linus said thanks, 1 minute ago
```

A binding is a promise you make: rustc checks every *call* against
`seconds: u32` and `-> String`, and nothing checks those against the
JavaScript. Misspell the export, and the build is happy, but the program
fails as it loads:

```
SyntaxError: Export named 'relativeTme' not found in module '.../js/time.js'.
```

Natively there's no JavaScript at all, so the body, `unreachable!()`,
panics if it's run. Keep the logic in plain Rust (`kept`, `greet`), which
`cargo test` runs, and the bindings thin.

## JavaScript calls Rust with a function

`keep: impl Fn(&Event) -> bool` takes any function, and from JavaScript
that's a JavaScript function:

```ts
// rust/src/lib.d.ts (generated)
export function feed(events: readonly Event[], now: number, keep: (event: Event) => boolean): string[];
```

```js
rust.feed(events, now, (e) => e.who !== 'bot')
```

## Where JavaScript is easier

Twenty-three chapters have shown what Rust checks that JavaScript
doesn't. Here's the other side:

- **Default parameters.** `greet(name, greeting = 'Hello')`. Rust has
  none: a missing parameter is an `Option` every Rust caller writes,
  `greet("Ada", None)`. (rust-js gives this one back: a trailing `Option`
  is an optional parameter, so JavaScript calls `greet('Ada')`.)
- **Any shape, right now.** An object literal with whatever fields you
  need, no struct declared first. `JSON.parse` gives you something to poke
  at; Rust wants the shape described (serde) before it reads.
- **No build step.** `bun file.js` runs. `cargo build` compiles, and a big
  project takes a while, since Rust's checks happen before anything runs.
- **Objects that point at each other.** A tree whose nodes know their
  parents is ordinary JavaScript. In Rust it's `Rc` and `Weak` (chapter
  20), or an arena of indices.
- **Closures capture freely.** A JavaScript callback takes whatever it
  uses. A Rust closure that outlives its maker needs `move`, and shared
  changes need `Rc<RefCell<..>>` (chapters 14 and 20).
- **The web's ecosystem.** npm has a package for everything a browser app
  needs, which is why rust-js binds JavaScript's rather than replacing it.

## So, when?

Use JavaScript where you'd pay those costs and rarely collect on the
checks: a page that changes every week, a script, a prototype. Use Rust,
here with rust-js, where a mistake is expensive: money, parsing,
permissions, anything where `undefined`, a forgotten `await`, a `||` that
ate a 0, or a `splice` in a loop would hurt. The point of this guide is
that you don't have to choose for a whole project. Rust compiles to
JavaScript that imports and is imported like any module, so you can move
the parts that need the checks and leave the rest where it is.

## One more thing rust-js is fixing

`kept` clones the events it keeps. Today rust-js leaves that clone out,
since no Rust code changes either copy, so the events JavaScript gets back
are its own objects. Change one, and the original changes too.
[rust-js#2408](https://github.com/rust-js-lang/rust-js/issues/2408) is the
fix, and `compare.test.js` pins what happens until it lands.

## Try it

In `lib.rs`, change `#relativeTime` to `#relativeTme`, run `bun run rust`,
then `bun chapters/24-calling-js-and-where-javascript-is-easier/compare.js`.
The build is happy; the program fails as the module loads, naming the
export it can't find.
