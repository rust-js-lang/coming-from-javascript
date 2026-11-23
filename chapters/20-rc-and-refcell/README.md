# 20. `Rc` and `RefCell`

## Sharing on purpose

Chapter 18's bug was *accidental* sharing: a match that kept the
caller's array. But sometimes sharing is the point. A page's header shows
how many items are in the cart, and the checkout adds to it. Both should
see one cart:

```js
// js/shop.js
export function makePage() {
  const cart = { items: [] }
  const header = { cart, badge: () => `${cart.items.length} items` }
  const checkout = { cart, add: (item) => cart.items.push(item) }
  return { header, checkout }
}
```

In JavaScript that's just how objects work: `header.cart` and
`checkout.cart` are the same object, and the garbage collector cleans up
when nobody holds it.

Rust's rules from chapters 18 and 19 (one owner; many readers or one
writer) don't allow it as written. So Rust gives you two tools to ask for
it.

## `Rc`: several owners, counted

`Rc<T>` (*reference counted*) lets a value have many owners:

```rust
// rust/src/lib.rs
struct Header {
    cart: Rc<Cart>,
}

struct Checkout {
    cart: Rc<Cart>,
}

let cart = Rc::new(Cart { items: RefCell::new(Vec::new()) });
let header = Header { cart: Rc::clone(&cart) };
let checkout = Checkout { cart: Rc::clone(&cart) };
```

`Rc::clone` doesn't copy the cart. It adds one more owner, and counts
it: `Rc::strong_count(&cart)` is 3 here. Each owner dropped takes one off,
and at zero the cart itself is dropped. It's a garbage collector for the
values you choose, freeing each at the moment its last owner goes.

## `RefCell`: change through a shared owner

An `Rc` shares for *reading*. With three owners, which one would be "the
one writer"? Try to push through it and:

```
error[E0596]: cannot borrow data in an `Rc` as mutable
```

`RefCell` moves chapter 19's rule from compile time to run time. You ask
it to lend, `borrow()` to read and `borrow_mut()` to change, and it counts
the borrows as the program runs:

```rust
struct Cart {
    items: RefCell<Vec<String>>,
}

impl Checkout {
    fn add(&self, item: &str) {
        self.cart.items.borrow_mut().push(item.to_string());
    }
}
```

`add` takes `&self`, a shared reference, and the items still change.
That's *interior mutability*: the change goes through the `RefCell`, which
checks the rule itself.

## The rule still holds

`RefCell` doesn't switch the rule off. It checks later:

```rust
pub fn read_while_adding() -> usize {
    let items = RefCell::new(vec!["tea".to_string()]);
    let reading = items.borrow();
    items.borrow_mut().push("cake".to_string());
    reading.len()
}
```

```
read while adding
  js:   2
  rust: panicked: RefCell already borrowed
```

JavaScript lets the reader and the writer share the array. Rust's
`RefCell` panics at the second borrow. You trade a compile error for a
run-time one, so keep each borrow short: borrow, use, let go.

## What rust-js writes

An `Rc` keeps its count, since Rust code can read it and the last owner's
drop must run. A `RefCell` whose borrows can't clash, like the cart's, is
the plain array:

```js
// rust/src/lib.js (generated)
const Checkout = {
  add(checkout, item) {
    checkout.cart.value.items.push(item);
  },
};

export function shop(items) {
  const cart = { value: { items: [] }, strong: 1, weak: 0 };
  // ...
    const header = { cart: $rcClone(cart) };
```

Where a borrow can clash, as in `read_while_adding`, the check is kept,
and it panics with native Rust's words.

## Where it's different

- **Reach for it last.** `Rc<RefCell<T>>` everywhere is JavaScript's
  model with extra steps and run-time panics. Most Rust code is shaped so
  one owner works: pass references down, return values up.
- **Cycles leak.** Two `Rc`s that point at each other never reach zero.
  A pointer back to a parent is a `Weak`, an owner that doesn't count.
- **One thread.** `Rc` and `RefCell` are for one thread, as JavaScript
  is. Their thread-safe cousins are `Arc` and `Mutex`.

## Try it

In `Cart`, change `items: RefCell<Vec<String>>` to `items: Vec<String>`,
and the `borrow`s to plain uses. Run `cargo build`: E0596, "cannot borrow
data in an `Rc` as mutable". The `Rc` shares; the `RefCell` is what lets
its owners write.
