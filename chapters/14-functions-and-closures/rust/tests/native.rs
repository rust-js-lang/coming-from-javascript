//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_14_functions_and_closures::{adder, adders, apply_twice, counter, twice_each};
use serde::Deserialize;

#[derive(Deserialize)]
struct Cases {
    adders: Vec<(i32, Vec<i32>)>,
    twice_each: Vec<(Vec<i32>, Vec<i32>)>,
    /// A fresh counter's first calls.
    counted: Vec<u32>,
    /// `adder(n)` applied twice to `x`.
    added_twice: Vec<(i32, i32, i32)>,
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Cases = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for (count, made) in &cases.adders {
        assert_eq!(&adders(*count), made);
    }
    for (ns, twice) in &cases.twice_each {
        assert_eq!(&twice_each(ns), twice);
    }
    let mut next = counter();
    let counted: Vec<u32> = cases.counted.iter().map(|_| next()).collect();
    assert_eq!(counted, cases.counted);
    for (n, x, twice) in cases.added_twice {
        assert_eq!(apply_twice(adder(n), x), twice);
    }
}

#[test]
fn two_counters_count_apart() {
    let mut a = counter();
    let mut b = counter();
    assert_eq!((a(), a(), b()), (1, 2, 1));
}
