//! Chapter 7: objects are structs. A struct names its fields and their
//! types once; its methods live in an `impl` block, and each says, with
//! `&self` or `&mut self`, whether it changes the struct.

/// A to-do item.
#[derive(Debug, Clone, PartialEq)]
pub struct Todo {
    pub title: String,
    pub done: bool,
    pub priority: u8,
}

impl Todo {
    /// A new to-do: not done, priority 1. `new` is a plain function that
    /// returns a `Todo`, by custom; Rust has no constructors.
    pub fn new(title: &str) -> Todo {
        Todo { title: title.to_string(), done: false, priority: 1 }
    }

    /// Marks it done: `&mut self`, as it changes the to-do.
    pub fn complete(&mut self) {
        self.done = true;
    }

    /// One more, up to 5.
    pub fn bump(&mut self) {
        self.priority = (self.priority + 1).min(5);
    }

    /// `[x] title (p2)`: `&self`, as it only reads.
    pub fn summary(&self) -> String {
        format!("[{}] {} (p{})", if self.done { "x" } else { " " }, self.title, self.priority)
    }
}

/// Each to-do's summary. The method itself can be passed: `Todo::summary`
/// is a function whose first parameter is the to-do, so nothing is lost.
pub fn summaries(todos: &[Todo]) -> Vec<String> {
    todos.iter().map(Todo::summary).collect()
}

/// How many aren't done.
pub fn remaining(todos: &[Todo]) -> usize {
    todos.iter().filter(|todo| !todo.done).count()
}
