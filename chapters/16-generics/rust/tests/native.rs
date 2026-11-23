//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_16_generics::{Stack, balanced, highest_score, largest, last_word};
use serde::Deserialize;

#[derive(Deserialize)]
struct Cases {
    scores: Vec<(Vec<u32>, Option<u32>)>,
    words: Vec<(Vec<String>, Option<String>)>,
    brackets: Vec<(String, bool)>,
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Cases = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for (scores, highest) in cases.scores {
        assert_eq!(highest_score(&scores), highest);
    }
    for (words, last) in cases.words {
        assert_eq!(last_word(&words), last);
    }
    for (text, ok) in &cases.brackets {
        assert_eq!(balanced(text), *ok, "{text}");
    }
}

#[test]
fn one_body_for_many_types() {
    assert_eq!(largest(&[1.5, -2.0, 0.25]), Some(&1.5));
    assert_eq!(largest(&['a', 'z', 'm']), Some(&'z'));
    let mut stack = Stack::new();
    stack.push("first");
    stack.push("second");
    assert_eq!((stack.pop(), stack.peek()), (Some("second"), Some("first")));
}
