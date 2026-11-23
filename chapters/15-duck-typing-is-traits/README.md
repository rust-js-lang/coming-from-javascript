# 15. Duck typing is traits

## If it quacks

JavaScript runs on duck typing: anything with a `send()` method can be
used as a notifier. There's no list of what a notifier needs; the code
that calls `send()` finds out when it calls it:

```js
// js/notify.js
export const email = (address) => ({
  channel: () => 'email',
  send: (message) => `emailed ${address}: ${message}`,
})

export const pager = (code) => ({
  channel: () => 'pager',
  sned: (message) => `paged ${code}: ${message}`,   // misspelled
})

export function broadcast(notifiers, message, log = []) {
  for (const notifier of notifiers) log.push(notifier.send(message))
  return log
}
```

```
js:   [
 "emailed ada@example.com: deploying",
 "then threw: notifier.send is not a function. ..."
]
```

The misspelled pager throws when the loop reaches it. By then the email
has gone out, and the texts after it never do. A half-finished broadcast
is worse than none.

## A trait names what a type can do

A Rust *trait* is the list JavaScript never writes down:

```rust
// rust/src/lib.rs
pub trait Notifier {
    fn channel(&self) -> String;
    fn send(&self, message: &str) -> String;
    fn preview(&self, message: &str) -> String {
        format!("{}: {}", self.channel(), message.chars().take(10).collect::<String>())
    }
}
```

A type is a `Notifier` only where an `impl` says so, and the `impl` must
have every method the trait lists:

```rust
impl Notifier for Email {
    fn channel(&self) -> String {
        "email".to_string()
    }
    fn send(&self, message: &str) -> String {
        format!("emailed {}: {message}", self.address)
    }
}
```

The misspelled pager can't be written:

```
error[E0407]: method `sned` is not a member of trait `Notifier`
error[E0046]: not all trait items implemented, missing: `send`
```

So nothing is sent until every notifier can send. The check happened
before the program ran.

- **Default methods.** `preview` has a body, so every notifier gets it
  for free. `Sms` writes its own, which takes its place.
- **Any type can implement your trait**, even one you didn't write, such
  as `String`. That's how a library adds abilities to types it doesn't
  own.

## One kind, or any kind: `impl` and `dyn`

```rust
pub fn notify(to: &impl Notifier, message: &str) -> String {
    to.send(message)
}
```

`&impl Notifier` is "some one type that's a notifier". Rust knows the
type at each call and calls its `send` directly.

A list of emails *and* texts needs something else, since a `Vec` holds
one type:

```rust
let mut notifiers: Vec<Box<dyn Notifier>> = Vec::new();
notifiers.push(Box::new(email.clone()));
notifiers.push(Box::new(phone.clone()));
notifiers.iter().map(|n| n.send(message)).collect()
```

`dyn Notifier` is "some notifier, I'll find out which when I call it",
what every JavaScript value is. `Box` puts each behind a pointer, as an
email and a text aren't the same size.

## What rust-js writes

An `impl` becomes an object of the type's methods, like JavaScript's
duck objects, but apart from the data, which it's handed:

```js
// rust/src/lib.js (generated)
export const emailNotifier = {
  channel: emailNotifier_channel,
  send: emailNotifier_send,
  preview: (email, message) => /* the default, filled in for emails */,
};

export function broadcast(emails, phones, message) {
  const notifiers = [];
  // ...
    notifiers.push({ value: email, impl: emailNotifier });
  // ...
  return notifiers.map((n) => n.impl.send(n.value, message));
}
```

A `dyn Notifier` is a pair, the value and its type's methods, and the data
stays a plain object, `{ address: "ada@example.com" }`. From JavaScript,
`notify(ada, 'hi', emailNotifier)` passes the methods beside the value.

## Where it's different

- **Nothing fits by accident.** A JavaScript object with a `send` method
  is a notifier whether it meant to be or not. A Rust type is one only
  where someone wrote `impl Notifier for` it.
- **Traits power the operators.** `==` is the trait `PartialEq` (chapter
  8), `{}` in `format!` is `Display`, and `for` loops use `IntoIterator`.
  Implement the trait, and the operator works for your type.

## Try it

In a test, write a `Pager` struct with `impl Notifier for Pager` and a
method named `sned`. Run `cargo test`: E0407 for `sned`, E0046 for the
missing `send`. Then in JavaScript, `broadcast` a list with `pager()` in
the middle, and log what was sent before it threw.
