//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_17_pattern_matching::{title, user_id};
use serde::Deserialize;

#[derive(Deserialize)]
struct Case {
    path: String,
    title: String,
    user_id: Option<u32>,
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Vec<Case> = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for case in cases {
        assert_eq!(title(&case.path), case.title, "{}", case.path);
        assert_eq!(user_id(&case.path), case.user_id, "{}", case.path);
    }
}
