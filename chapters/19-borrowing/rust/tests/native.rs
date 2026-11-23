//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_19_borrowing::{Task, mark_all_done, pending_count, remove_done, swap_ends};
use serde::Deserialize;

/// A list of tasks, each `[title, done]`, and what each function makes of it.
#[derive(Deserialize)]
struct Case {
    tasks: Vec<(String, bool)>,
    pending: usize,
    after_remove: Vec<String>,
    after_swap: Vec<String>,
}

fn tasks(rows: &[(String, bool)]) -> Vec<Task> {
    rows.iter().map(|(title, done)| Task { title: title.clone(), done: *done }).collect()
}

fn titles(tasks: &[Task]) -> Vec<String> {
    tasks.iter().map(|t| t.title.clone()).collect()
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Vec<Case> = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for case in cases {
        assert_eq!(pending_count(&tasks(&case.tasks)), case.pending);
        let mut removed = tasks(&case.tasks);
        remove_done(&mut removed);
        assert_eq!(titles(&removed), case.after_remove);
        let mut swapped = tasks(&case.tasks);
        swap_ends(&mut swapped);
        assert_eq!(titles(&swapped), case.after_swap);
        let mut all = tasks(&case.tasks);
        mark_all_done(&mut all);
        assert_eq!(pending_count(&all), 0);
    }
}
