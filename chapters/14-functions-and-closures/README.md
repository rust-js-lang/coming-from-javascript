# 14. Functions and closures

## JavaScript's closures keep variables, not values

A closure is a function that uses variables from where it was made.
JavaScript is built on them, and they hold on to the *variable* itself,
not its value at the time. That's what makes a counter work:

```js
// js/closures.js
export function counter() {
  let n = 0
  return () => {
    n += 1
    return n
  }
}
```

and what makes this classic surprise happen:

```js
export function addersWithVar(count) {
  const adders = []
  for (var i = 0; i < count; i++) adders.push((x) => x + i)
  return adders.map((add) => add(10))
}
```

```
three adders made in a loop, each given 10
  js, var: [13,13,13]
  js, let: [10,11,12]
```

With `var`, there's one `i` for the whole loop. All three closures share
it, and by the time they run it's 3. `let` makes a new `i` for each pass,
which is why modern JavaScript uses it.

## Rust's closures

A Rust closure is written `|parameters| body`:

```rust
// rust/src/lib.rs
pub fn adders(count: i32) -> Vec<i32> {
    let mut made = Vec::new();
    for i in 0..count {
        made.push(move |x: i32| x + i);
    }
    made.iter().map(|add| add(10)).collect()
}
```

Each pass of a `for` loop has its own `i`, and the closure takes a copy
of it, so there's no shared variable to surprise you: `[10, 11, 12]`.

### `move`: the closure takes what it uses

A closure that outlives the function that made it can't keep borrowing
that function's variables, since they're gone when it returns. Leave out
`move` here:

```rust
pub fn adder(n: i32) -> impl Fn(i32) -> i32 {
    move |x| x + n
}
```

and the compiler explains, with the fix:

```
error[E0373]: closure may outlive the current function, but it borrows `n`, which is owned by the current function
help: to force the closure to take ownership of `n` (and any other referenced variables), use the `move` keyword
```

In JavaScript, the garbage collector keeps `n` alive as long as the
closure is. In Rust, the closure *takes* `n` with `move`, and owns it
from then on (chapter 18 is about owning).

### What a closure does to what it holds, in its type

`impl Fn(i32) -> i32` means "some function from an `i32` to an `i32`".
Rust has three kinds of function type:

| Type | The closure | Example |
|---|---|---|
| `Fn` | only reads what it holds | `adder`: reads `n` |
| `FnMut` | changes what it holds | `counter`: adds to `n` |
| `FnOnce` | uses up what it holds, so it can run once | a closure that gives away a `String` it owns |

```rust
pub fn counter() -> impl FnMut() -> u32 {
    let mut n = 0;
    move || {
        n += 1;
        n
    }
}
```

Calling an `FnMut` changes it, so the variable holding it must be `let
mut` (chapter 3):

```rust
let next = counter();
next();
```

```
error[E0596]: cannot borrow `next` as mutable, as it is not declared as mutable
```

### Functions as parameters

```rust
pub fn apply_twice(f: impl Fn(i32) -> i32, x: i32) -> i32 {
    f(f(x))
}
```

`impl Fn(i32) -> i32` takes any such function: a closure, or a named
function.

## What rust-js writes

A closure is an arrow function, and a function Rust returns is a
JavaScript function your code can call:

```js
// rust/src/lib.js (generated)
export function adder(n) {
  return (x) => (x + n) | 0;
}

export function counter() {
  const n = 0;
  let n$1 = n;
  return () => {
    n$1 = (n$1 + 1) >>> 0;
    return n$1;
  };
}
```

```ts
// rust/src/lib.d.ts (generated)
export function adder(n: number): (value: number) => number;
export function applyTwice(f: (value: number) => number, x: number): number;
```

They mix freely: `compare.test.js` passes JavaScript's `adder(5)` to
Rust's `applyTwice` and Rust's to JavaScript's.

## Where it's different

- **No `this` in a closure.** A closure sees variables, never a `this`.
  A method's object is its `self` parameter (chapter 7).
- **Every closure has its own type.** Two closures with the same
  parameters are different types, so a list of different closures needs
  `Box<dyn Fn(i32) -> i32>` (chapter 15).

## Try it

In `adder`, remove `move` and run `cargo build`: E0373, and the compiler
says to add `move`. Then in a test, write `let next = counter(); next();`:
E0596. A counter changes, so it's `let mut next`.
