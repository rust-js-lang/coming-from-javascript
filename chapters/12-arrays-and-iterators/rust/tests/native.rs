//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_12_arrays_and_iterators::{Student, first_failing, highest, passed, score_at, top_three};
use serde::Deserialize;

#[derive(Deserialize)]
struct Scores {
    scores: Vec<u32>,
    top_three: Vec<u32>,
    highest: Option<u32>,
    /// `score_at` of 0, 1 and 10.
    at: [Option<u32>; 3],
}

#[derive(Deserialize)]
struct Cases {
    scores: Vec<Scores>,
    classes: Vec<(Vec<(String, u32)>, Vec<String>, Option<String>)>,
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Cases = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for case in &cases.scores {
        let s = &case.scores;
        assert_eq!(top_three(s), case.top_three);
        assert_eq!(highest(s), case.highest);
        assert_eq!([score_at(s, 0), score_at(s, 1), score_at(s, 10)], case.at);
    }
    for (class, names, failing) in cases.classes {
        let class: Vec<Student> = class.into_iter().map(|(name, score)| Student { name, score }).collect();
        assert_eq!(passed(&class), names);
        assert_eq!(first_failing(&class), failing);
    }
}

#[test]
fn top_three_leaves_the_scores_as_they_were() {
    let scores = vec![9, 100, 85, 10];
    top_three(&scores);
    assert_eq!(scores, [9, 100, 85, 10]);
}
