# 22. `async`

## The same words

```js
// js/users.js
export async function greeting(id) {
  try {
    const user = await loadUser(id)
    return `Hello, ${user.name}!`
  } catch (error) {
    return `sorry: ${error.message}`
  }
}
```

```rust
// rust/src/lib.rs
pub async fn greeting(id: u32) -> String {
    match load_user(id).await {
        Ok(user) => format!("Hello, {}!", user.name),
        Err(why) => format!("sorry: {why}"),
    }
}
```

`async fn` and `await` read the same. Two differences show at once.
`.await` goes *after* the expression, so it chains:
`load_user(id).await?.age`. And failure is a `Result` (chapter 11), so
`load_user`'s first line says it can fail, where a rejected promise is
something you're told about only by its documentation.

## The forgotten `await`

The most common async bug in JavaScript:

```js
export function greetingForgotten(id) {
  const user = loadUser(id)       // a Promise, not a user
  return `Hello, ${user.name}!`
}
```

```
await forgotten, user 1   js: Hello, undefined!
```

A promise has no `name`, so the greeting says `undefined`. And for a user
that doesn't exist, the promise rejects with nobody listening: an
"unhandled rejection" that turns up later, somewhere else.

In Rust, an `async fn`'s result is a *future*, a value of its own type.
It isn't a `User`, and the compiler won't let you treat it as one:

```
error[E0609]: no field `name` on type `impl Future<Output = Result<User, String>>`
```

The type even tells you what you'd get by awaiting: a `Result<User,
String>`.

## A future waits; a promise starts

One more difference, underneath. A JavaScript promise starts running the
moment it's made. A Rust future does *nothing* until something polls it,
and `.await` is what polls. That's why Rust needs an *executor* to drive
futures: tokio on a server, or, in this chapter's tests, a ten-line
`block_on` in `native.rs`. Rust's standard library defines futures but
ships no executor.

## What rust-js writes

An `async fn` is an `async function`, `.await` is `await`, and the
JavaScript event loop is the executor:

```js
// rust/src/lib.js (generated)
export async function greeting(id) {
  const value = await loadUser(id);
  return value.TAG === "Ok" ? `Hello, ${value._0.name}!` : `sorry: ${value._0}`;
}
```

```ts
// rust/src/lib.d.ts (generated)
export function greeting(id: number): Promise<string>;
```

Your JavaScript `await`s it like any async function. In rust-js a future
is a promise, so it starts when it's made. For almost all code that
changes nothing. Code that relies on Rust's waiting, such as making a
future and never awaiting it, would run differently, and rust-js refuses
to compile it rather than quietly change what it means
([coming-from-typescript's chapter 21](https://github.com/rust-js-lang/coming-from-typescript/tree/main/chapters/21-async)
shows those errors).

## Where it's different

- **No unhandled rejections.** A failure is a `Result` the code must look
  at, and an `Err` can't go unnoticed.
- **Doing several at once** is `Promise.all` in JavaScript. Rust's
  executors give the same (`join!`, `join_all`), and in rust-js
  `js::promise::all` *is* `Promise.all`.
- **Threads.** A Rust executor like tokio may run futures on several
  threads, so what they hold must be safe to share. JavaScript, and so
  rust-js, has one thread.

## Try it

In `greeting`, replace the `match` with `let user = load_user(id);` and
`format!("Hello, {}!", user.name)`. Run `cargo build`: E0609, a future has
no `name`. Add `.await` and it's a `Result`, which the compiler then makes
you open before you reach the `name`.
