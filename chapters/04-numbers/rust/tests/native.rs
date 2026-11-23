//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_04_numbers::{add_lives, average, next_id, percent, split_bill};
use serde::Deserialize;

#[derive(Deserialize)]
struct Cases {
    bills: Vec<(u32, u32, (u32, u32))>,
    averages: Vec<(Vec<f64>, f64)>,
    percents: Vec<(u32, u32, u32)>,
    /// A `u64` as text: JSON's numbers are floats, which can't hold them all.
    ids: Vec<(String, String)>,
    lives: Vec<(u8, u8, u8)>,
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Cases = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for (total, people, split) in cases.bills {
        assert_eq!(split_bill(total, people), split);
    }
    for (scores, mean) in &cases.averages {
        assert_eq!(average(scores), *mean);
    }
    for (part, whole, pct) in cases.percents {
        assert_eq!(percent(part, whole), pct, "{part} of {whole}");
    }
    for (id, next) in &cases.ids {
        assert_eq!(next_id(id.parse().unwrap()).to_string(), *next);
    }
    for (lives, more, total) in cases.lives {
        assert_eq!(add_lives(lives, more), total);
    }
}

#[test]
#[should_panic(expected = "divide by zero")]
fn splitting_among_nobody_panics() {
    split_bill(1000, 0);
}

#[test]
fn the_average_of_nothing_is_nan() {
    assert!(average(&[]).is_nan());
}
