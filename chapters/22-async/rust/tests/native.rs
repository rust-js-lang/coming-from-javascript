//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_22_async::{greeting, total_age};
use serde::Deserialize;
use std::pin::pin;
use std::task::{Context, Poll, Waker};

/// Runs a future to its end: an executor of one loop. Native Rust needs one,
/// as nothing runs a future by itself; JavaScript's event loop is rust-js's.
pub fn block_on<F: Future>(future: F) -> F::Output {
    let mut future = pin!(future);
    let mut context = Context::from_waker(Waker::noop());
    loop {
        if let Poll::Ready(value) = future.as_mut().poll(&mut context) {
            return value;
        }
    }
}

#[derive(Deserialize)]
struct Cases {
    greetings: Vec<(u32, String)>,
    totals: Vec<(Vec<u32>, Result<u32, String>)>,
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Cases = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for (id, said) in cases.greetings {
        assert_eq!(block_on(greeting(id)), said);
    }
    for (ids, total) in cases.totals {
        assert_eq!(block_on(total_age(&ids)), total);
    }
}
