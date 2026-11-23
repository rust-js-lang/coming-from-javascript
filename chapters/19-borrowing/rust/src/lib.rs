//! Chapter 19: borrowing. A reference lends a value without giving it
//! away: `&` to read, `&mut` to change. Many readers, or one writer, never
//! both at once.

/// A task.
#[derive(Debug, Clone, PartialEq)]
pub struct Task {
    pub title: String,
    pub done: bool,
}

/// How many aren't done: `&[Task]` lends the tasks to read.
pub fn pending_count(tasks: &[Task]) -> usize {
    tasks.iter().filter(|t| !t.done).count()
}

/// Marks every task done, in place: `&mut [Task]` lends them to change,
/// and `iter_mut` lends each one, `&mut Task`, in turn.
pub fn mark_all_done(tasks: &mut [Task]) {
    for task in tasks.iter_mut() {
        task.done = true;
    }
}

/// Removes the done tasks, in place. Removing inside a `for` over the same
/// list doesn't compile; `retain` walks and removes in one careful step.
pub fn remove_done(tasks: &mut Vec<Task>) {
    tasks.retain(|task| !task.done);
}

/// Swaps the first task and the last. Two `&mut`s into one list at once
/// would be two writers, so the list does it itself, `swap`.
pub fn swap_ends(tasks: &mut [Task]) {
    if tasks.len() > 1 {
        let last = tasks.len() - 1;
        tasks.swap(0, last);
    }
}
