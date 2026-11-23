//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_13_map_set_and_objects_as_maps::{shared_words, sorted_counts, word_counts};
use serde::Deserialize;

#[derive(Deserialize)]
struct Cases {
    counts: Vec<(String, Vec<(String, u32)>)>,
    shared: Vec<(String, String, Vec<String>)>,
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Cases = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for (text, sorted) in &cases.counts {
        assert_eq!(&sorted_counts(text), sorted, "{text}");
        // A HashMap's order is no promise: the same counts, sorted to compare.
        let mut counts: Vec<(String, u32)> = word_counts(text).into_iter().collect();
        counts.sort();
        assert_eq!(&counts, sorted, "{text}");
    }
    for (a, b, shared) in &cases.shared {
        assert_eq!(&shared_words(a, b), shared);
    }
}
