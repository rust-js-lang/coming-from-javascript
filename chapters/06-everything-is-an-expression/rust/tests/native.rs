//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_06_everything_is_an_expression::{day_kind, grade, shipping, steps_to_one};
use serde::Deserialize;

#[derive(Deserialize)]
struct Cases {
    shipping: Vec<(u32, u32)>,
    grades: Vec<(u32, char)>,
    days: Vec<(String, String)>,
    steps: Vec<(u64, u32)>,
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Cases = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for (total, cents) in cases.shipping {
        assert_eq!(shipping(total), cents, "{total}");
    }
    for (score, letter) in cases.grades {
        assert_eq!(grade(score), letter, "{score}");
    }
    for (day, kind) in &cases.days {
        assert_eq!(day_kind(day), kind);
    }
    for (n, steps) in cases.steps {
        assert_eq!(steps_to_one(n), steps, "{n}");
    }
}
