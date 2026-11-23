//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_20_rc_and_refcell::{owners, read_while_adding, shop};
use serde::Deserialize;

#[derive(Deserialize)]
struct Cases {
    shopping: Vec<(Vec<String>, Vec<String>)>,
    owners: usize,
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Cases = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for (items, badges) in &cases.shopping {
        assert_eq!(&shop(items), badges);
    }
    assert_eq!(owners(), cases.owners);
}

#[test]
#[should_panic(expected = "RefCell already borrowed")]
fn a_refcell_refuses_a_writer_while_it_lends_a_reader() {
    read_while_adding();
}
