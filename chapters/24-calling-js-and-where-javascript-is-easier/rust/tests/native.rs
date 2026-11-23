//! The chapter's cases, run by native Rust: what rust-js's JS must say too.
//! `feed` calls JavaScript, so its plain parts run here, and its binding
//! panics natively.

use chapter_24_calling_js_and_where_javascript_is_easier::{Event, feed, greet, kept};
use serde::Deserialize;

#[derive(Deserialize)]
struct Cases {
    /// Each event `[who, did, at]`, and who's kept of those whose `who` isn't "bot".
    events: Vec<(String, String, u32)>,
    kept: Vec<String>,
    greetings: Vec<(String, Option<String>, String)>,
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Cases = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    let events: Vec<Event> =
        cases.events.into_iter().map(|(who, did, at)| Event { who, did, at }).collect();
    let people: Vec<String> = kept(&events, |e| e.who != "bot").into_iter().map(|e| e.who).collect();
    assert_eq!(people, cases.kept);
    for (name, greeting, said) in &cases.greetings {
        assert_eq!(&greet(name, greeting.as_deref()), said);
    }
}

#[test]
#[should_panic(expected = "a binding runs only in JavaScript")]
fn a_binding_has_nothing_to_call_natively() {
    feed(&[Event { who: "ada".into(), did: "pushed".into(), at: 0 }], 60, |_| true);
}
