//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_02_types_are_checked_before_it_runs::{User, greet, items_label, next_quantity, parse_quantity};
use serde::Deserialize;

#[derive(Deserialize)]
struct Cases {
    greetings: Vec<(String, u32, String)>,
    next: Vec<(u32, u32)>,
    parsed: Vec<(String, u32)>,
    labels: Vec<(u32, String)>,
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Cases = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for (name, age, said) in cases.greetings {
        assert_eq!(greet(&User { name, age }), said);
    }
    for (n, next) in cases.next {
        assert_eq!(next_quantity(n), next);
    }
    for (text, n) in &cases.parsed {
        assert_eq!(parse_quantity(text), *n, "{text:?}");
    }
    for (n, said) in &cases.labels {
        assert_eq!(&items_label(*n), said);
    }
}
