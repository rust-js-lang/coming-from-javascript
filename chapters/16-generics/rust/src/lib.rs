//! Chapter 16: generics. One function for many types, `<T>`, and a bound,
//! `T: PartialOrd`, that says what a `T` must be able to do before the
//! body may do it.

/// The largest item, if there are any: for any `T` that can be compared
/// with `>`. It gives back a reference to the item in the list.
pub fn largest<T: PartialOrd>(items: &[T]) -> Option<&T> {
    let mut best = items.first()?;
    for item in items {
        if item > best {
            best = item;
        }
    }
    Some(best)
}

/// The highest score: `largest` of `u32`s.
pub fn highest_score(scores: &[u32]) -> Option<u32> {
    largest(scores).copied()
}

/// The word last in the alphabet: `largest` of `String`s.
pub fn last_word(words: &[String]) -> Option<String> {
    largest(words).cloned()
}

/// A stack of anything: a generic struct.
#[derive(Debug, Clone, PartialEq, Default)]
pub struct Stack<T> {
    pub items: Vec<T>,
}

impl<T: Clone> Stack<T> {
    pub fn new() -> Stack<T> {
        Stack { items: Vec::new() }
    }

    pub fn push(&mut self, item: T) {
        self.items.push(item);
    }

    pub fn pop(&mut self) -> Option<T> {
        self.items.pop()
    }

    pub fn peek(&self) -> Option<T> {
        self.items.last().cloned()
    }
}

/// Whether every bracket in `text` is closed by its partner, in order: a
/// `Stack<char>` keeps the ones still open.
pub fn balanced(text: &str) -> bool {
    let mut open = Stack::new();
    for c in text.chars() {
        let partner = match c {
            ')' => '(',
            ']' => '[',
            '}' => '{',
            '(' | '[' | '{' => {
                open.push(c);
                continue;
            }
            _ => continue,
        };
        if open.pop() != Some(partner) {
            return false;
        }
    }
    open.peek().is_none()
}
