//! An integration test: a crate of its own, which sees only the library's
//! public API, as a user does. It runs the chapter's cases, natively under
//! `cargo test`, and as JavaScript under `rust-js test`.

use chapter_23_testing::{average, strength};
use serde::Deserialize;

#[derive(Deserialize)]
struct Cases {
    passwords: Vec<(String, String)>,
    averages: Vec<(Vec<u32>, u32)>,
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Cases = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for (password, said) in &cases.passwords {
        assert_eq!(strength(password), said, "{password}");
    }
    for (scores, mean) in &cases.averages {
        assert_eq!(average(scores), *mean);
    }
}
