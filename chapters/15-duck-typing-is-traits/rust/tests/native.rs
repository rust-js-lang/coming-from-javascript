//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_15_duck_typing_is_traits::{Email, Sms, broadcast, notify, previews};
use serde::Deserialize;

#[derive(Deserialize)]
struct Case {
    emails: Vec<String>,
    phones: Vec<String>,
    message: String,
    sent: Vec<String>,
    previews: Vec<String>,
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Vec<Case> = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for case in cases {
        let emails: Vec<Email> = case.emails.into_iter().map(|address| Email { address }).collect();
        let phones: Vec<Sms> = case.phones.into_iter().map(|number| Sms { number }).collect();
        assert_eq!(broadcast(&emails, &phones, &case.message), case.sent);
        assert_eq!(previews(&emails, &phones, &case.message), case.previews);
    }
}

#[test]
fn one_generic_function_for_either_kind() {
    assert_eq!(notify(&Email { address: "ada@example.com".into() }, "hi"), "emailed ada@example.com: hi");
    assert_eq!(notify(&Sms { number: "555".into() }, "hi"), "texted 555: hi");
}
