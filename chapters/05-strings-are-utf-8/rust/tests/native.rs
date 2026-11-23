//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_05_strings_are_utf_8::{byte_size, capitalize, char_count, greet_all, reverse, truncate};
use serde::Deserialize;

#[derive(Deserialize)]
struct Text {
    text: String,
    chars: usize,
    bytes: usize,
    truncated: String,
    reversed: String,
    capitalized: String,
}

#[derive(Deserialize)]
struct Cases {
    texts: Vec<Text>,
    greetings: Vec<(Vec<String>, String)>,
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Cases = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for case in &cases.texts {
        let text = &case.text;
        assert_eq!(char_count(text), case.chars, "{text}");
        assert_eq!(byte_size(text), case.bytes, "{text}");
        assert_eq!(truncate(text, 3), case.truncated, "{text}");
        assert_eq!(reverse(text), case.reversed, "{text}");
        assert_eq!(capitalize(text), case.capitalized, "{text}");
    }
    for (names, said) in &cases.greetings {
        let names: Vec<&str> = names.iter().map(String::as_str).collect();
        assert_eq!(&greet_all(&names), said);
    }
}
