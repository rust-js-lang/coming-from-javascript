//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_07_objects_are_structs::{Todo, remaining, summaries};
use serde::Deserialize;

/// To-dos made from their titles, then each step done in turn: `complete`
/// or `bump` of the one at an index.
#[derive(Deserialize)]
struct Case {
    titles: Vec<String>,
    steps: Vec<(String, usize)>,
    summaries: Vec<String>,
    remaining: usize,
}

/// The to-dos a case ends with.
pub fn run(titles: &[String], steps: &[(String, usize)]) -> Vec<Todo> {
    let mut todos: Vec<Todo> = titles.iter().map(|title| Todo::new(title)).collect();
    for (step, at) in steps {
        match step.as_str() {
            "complete" => todos[*at].complete(),
            _ => todos[*at].bump(),
        }
    }
    todos
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Vec<Case> = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for case in cases {
        let todos = run(&case.titles, &case.steps);
        assert_eq!(summaries(&todos), case.summaries);
        assert_eq!(remaining(&todos), case.remaining);
    }
}
