# 9. String flags are enums

## A state as a string

JavaScript code often keeps a value's state in a string, with whatever
data each state needs as properties beside it:

```js
// js/orders.js
//   { state: 'pending' }
//   { state: 'paid', amountCents }
//   { state: 'shipped', tracking }
//   { state: 'cancelled', reason }

export function describe(order) {
  switch (order.state) {
    case 'pending':
      return 'waiting for payment'
    case 'paid':
      return `paid ${order.amountCents} cents`
    case 'shiped':
      return `on its way: ${order.tracking}`
    // ...
    default:
      return 'unknown'
  }
}
```

The strings are only a convention:
- **A typo is a new state.** `'shiped'` matches nothing, so every shipped
  order falls to `default` and says `unknown`.
- **Every property is reachable from every state.** A pending order has
  no tracking number, and `order.tracking` is `undefined`, not an error.
- **Nothing lists the states.** Add `'refunded'` next month and nothing
  points to the `switch`es that don't handle it.

## An enum lists every state

```rust
// rust/src/lib.rs
pub enum Order {
    Pending,
    Paid { amount_cents: u32 },
    Shipped { tracking: String },
    Cancelled { reason: String },
}
```

An `enum` is a type whose value is exactly one of its *variants*, and
each variant carries only its own data: only `Shipped` has a `tracking`.
A `match` checks which variant it is and takes that variant's data out,
in one step:

```rust
pub fn describe(order: &Order) -> String {
    match order {
        Order::Pending => "waiting for payment".to_string(),
        Order::Paid { amount_cents } => format!("paid {amount_cents} cents"),
        Order::Shipped { tracking } => format!("on its way: {tracking}"),
        Order::Cancelled { reason } => format!("cancelled: {reason}"),
    }
}
```

The three problems are gone:

- A misspelled variant isn't a variant:
  ```
  error[E0599]: no variant named `Shiped` found for enum `Order`
  help: there is a variant with a similar name
  ```
- `tracking` exists only inside the `Shipped` arm, so there's no way to
  read one of a pending order.
- A `match` must handle every variant. Leave one out, or add `Refunded`
  to the enum, and every `match` that doesn't handle it is an error:
  ```
  error[E0004]: non-exhaustive patterns: `&Order::Cancelled { .. }` not covered
  ```

For a yes-or-no question, `matches!` is a short `match`:

```rust
pub fn can_cancel(order: &Order) -> bool {
    matches!(order, Order::Pending | Order::Paid { .. })
}
```

`{ .. }` means "with whatever data".

## What rust-js writes

Two attributes make each variant the JavaScript object you'd have
written: `#[rust_js::tag = "state"]` names the field that says which
state, and `#[rust_js::name = "paid"]` each state's string. The
JavaScript is the `if` chain you'd write, without the typo:

```js
// rust/src/lib.js (generated)
export function describe(order) {
  if (order.state === "pending") {
    return "waiting for payment";
  }
  if (order.state === "paid") {
    return `paid ${order.amountCents} cents`;
  }
  if (order.state === "shipped") {
    return `on its way: ${order.tracking}`;
  }
  return `cancelled: ${order.reason}`;
}
```

The last arm needs no check: it's the only state left. Your JavaScript
passes plain objects, `{ state: 'paid', amountCents: 2599 }`, and the
`.d.ts` lists the four shapes, so your editor knows them too. Without
the attributes, rust-js's own form is `{ TAG: "Paid", amountCents }`,
which is fine where only Rust reads it.

## Side by side

`compare.test.js` passes the same four objects to both sides. They agree
on all four but the shipped one, which JavaScript's misspelled `case`
calls `unknown`.

## Where it's different

- **An enum of no data is a list of names.** `enum Direction { North,
  South, East, West }` is the safe version of the string constants
  JavaScript code keeps in an object.
- **Enums are everywhere in Rust.** The next two chapters are about two
  in the standard library: `Option`, for a value that may be missing, and
  `Result`, for one that may have failed.

## Try it

Add `Refunded { amount_cents: u32 },` to `Order` and run `cargo build`.
The compiler points at `describe` (non-exhaustive patterns). `can_cancel`
and `ship` already have an arm for anything else, so they compile. Then
add a `'refunded'` state to an order in JavaScript: `describe` quietly
says `unknown`.
