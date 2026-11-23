// Chapter 7: a to-do item as a JavaScript class, beside `rust/src/lib.rs`'s
// struct and its methods.

export class Todo {
  constructor(title) {
    this.title = title
    this.done = false
    this.priority = 1
  }

  complete() {
    this.done = true
  }

  // One more, up to 5.
  bump() {
    this.priority = Math.min(this.priority + 1, 5)
  }

  summary() {
    return `[${this.done ? 'x' : ' '}] ${this.title} (p${this.priority})`
  }
}

// Each to-do's summary. `map(todo => todo.summary())` keeps `this`.
export const summaries = (todos) => todos.map((todo) => todo.summary())

// How many aren't done.
export const remaining = (todos) => todos.filter((todo) => !todo.done).length

// Marks a to-do done, with the property's name mistyped: a new property
// `donee` is made, and `done` stays false.
export function markDoneMistyped(todo) {
  todo.donee = true
}

// Each summary, passing the method itself to `map`: it's called without
// its object, `this` is undefined, and it throws.
export const summariesLosingThis = (todos) => todos.map(Todo.prototype.summary)
