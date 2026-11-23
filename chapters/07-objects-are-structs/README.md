# 7. Objects are structs

## A JavaScript object takes any shape

A JavaScript object is a bag of properties. You can add one at any time,
by assigning to it, and a class describes the shape its constructor
*happens* to make:

```js
// js/todo.js
export class Todo {
  constructor(title) {
    this.title = title
    this.done = false
    this.priority = 1
  }

  complete() {
    this.done = true
  }

  summary() {
    return `[${this.done ? 'x' : ' '}] ${this.title} (p${this.priority})`
  }
}
```

That freedom has two well-known costs. A mistyped property name makes a
*new* property, silently:

```js
todo.donee = true   // the to-do is still not done
```

And `this` depends on how a method is *called*, not where it's written.
Pass the method on its own, as `todos.map(Todo.prototype.summary)` does,
and it's called with no object: `this` is `undefined`, and it throws a
`TypeError`.

## A struct names its fields once

Rust's `struct` lists every field, and its type, in one place:

```rust
// rust/src/lib.rs
pub struct Todo {
    pub title: String,
    pub done: bool,
    pub priority: u8,
}
```

A `Todo` has exactly these fields, always. You can't add one by
assigning to it, and you can't misspell one:

```
error[E0609]: no field `donee` on type `Todo`
help: a field with a similar name exists
```

`pub` makes a field visible outside this module (chapter 21). Making a
`Todo` means giving every field a value: `Todo { title, done: false,
priority: 1 }`. There's no field left `undefined`.

## Methods live in `impl`, with `self` written out

```rust
impl Todo {
    pub fn new(title: &str) -> Todo {
        Todo { title: title.to_string(), done: false, priority: 1 }
    }

    pub fn complete(&mut self) {
        self.done = true;
    }

    pub fn summary(&self) -> String {
        format!("[{}] {} (p{})", if self.done { "x" } else { " " }, self.title, self.priority)
    }
}
```

- **`new` is a plain function.** Rust has no constructors and no `new`
  keyword: `Todo::new("buy milk")` is a function, named `new` by custom,
  that returns a `Todo`.
- **`self` is a parameter.** Where JavaScript's `this` is decided by
  the call, Rust's `self` is the method's first parameter, written out.
  `todo.complete()` is short for `Todo::complete(&mut todo)`.
- **`&self` reads, `&mut self` changes.** Chapter 3's rule: `summary`
  only reads the to-do, and `complete` changes it, so it can only be
  called on a `let mut` to-do (E0596 otherwise).

Because `self` is just the first parameter, a method can be passed on its
own and nothing is lost:

```rust
pub fn summaries(todos: &[Todo]) -> Vec<String> {
    todos.iter().map(Todo::summary).collect()
}
```

## What rust-js writes

The struct is a plain JavaScript object, and the methods are functions
that take it as their first argument:

```js
// rust/src/lib.js (generated)
export const Todo = {
  new(title) {
    return { title, done: false, priority: 1 };
  },

  complete(todo) {
    todo.done = true;
  },

  summary(todo) {
    return `[${todo.done ? "x" : " "}] ${todo.title} (p${todo.priority})`;
  },
};

export function summaries(todos) {
  return todos.map(Todo.summary);
}
```

No class and no `this`, so `todos.map(Todo.summary)` is safe in
JavaScript too. From JavaScript you write `Todo.complete(todo)` rather
than `todo.complete()`. The data stays plain, so it prints, compares and
`JSON.stringify`s as any object does, and an object your JavaScript
builds works as well as one Rust made.

## Side by side

```
todo.donee = true
  js:   [ ] buy milk (p1), and now it has a 'donee' too
  rust: won't compile: no field donee on type Todo
todos.map(Todo.prototype.summary)
  js:   throws: undefined is not an object (evaluating 'this.done')
  rust: ["[ ] buy milk (p1)"], from todos.iter().map(Todo::summary)
```

`compare.test.js` runs the same steps (complete, bump) on both sides'
to-dos and checks the summaries against native Rust's.

## Where it's different

- **No inheritance.** A struct can't `extends` another. Chapter 15 shows
  what Rust uses instead (traits), and chapter 9 how one type can have
  several shapes (enums).
- **Abilities are asked for.** A new struct can't even be printed for
  debugging or compared with `==` until it asks: `#[derive(Debug, Clone,
  PartialEq)]` above the struct. That's chapter 8.

## Try it

In a test, write `let mut todo = Todo::new("milk"); todo.donee = true;`
and run `cargo test`: E0609, and the compiler suggests `done`. Then drop
the `mut`, `let todo = ...; todo.complete();`: E0596, since `complete`
changes the to-do.
