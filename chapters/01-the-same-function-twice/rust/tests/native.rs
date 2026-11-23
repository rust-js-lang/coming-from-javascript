//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_01_the_same_function_twice::{fizzbuzz, initials, total};
use serde::Deserialize;

#[derive(Deserialize)]
struct Cases {
    fizzbuzz: Vec<(u32, String)>,
    totals: Vec<(Vec<f64>, f64)>,
    initials: Vec<(String, String)>,
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Cases = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for (n, said) in &cases.fizzbuzz {
        assert_eq!(&fizzbuzz(*n), said, "{n}");
    }
    for (prices, sum) in &cases.totals {
        assert_eq!(total(prices), *sum, "{prices:?}");
    }
    for (name, said) in &cases.initials {
        assert_eq!(&initials(name), said, "{name}");
    }
}
