//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_10_null_and_undefined_are_option::{Profile, display_name, find, managers_name, volume};
use serde::Deserialize;

#[derive(Deserialize)]
struct Case {
    name: String,
    display_name: Option<String>,
    volume: Option<u32>,
    managers_name: Option<String>,
}

/// The team every case asks about, as team.js has it.
pub fn team() -> Vec<Profile> {
    let p = |name: &str, nickname: Option<&str>, volume: Option<u32>, manager: Option<&str>| Profile {
        name: name.to_string(),
        nickname: nickname.map(str::to_string),
        volume,
        manager_name: manager.map(str::to_string),
    };
    vec![
        p("Ada", Some("Countess"), Some(0), None),
        p("Grace", None, None, Some("Ada")),
        p("Linus", Some("Tux"), Some(80), Some("Grace")),
        p("Alan", None, None, Some("Turing")),
    ]
}

#[test]
fn native_rust_says_what_each_case_says() {
    let team = team();
    let cases: Vec<Case> = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for case in cases {
        let person = find(&team, &case.name);
        assert_eq!(person.map(|p| display_name(p).to_string()), case.display_name, "{}", case.name);
        assert_eq!(person.map(volume), case.volume, "{}", case.name);
        assert_eq!(managers_name(&team, &case.name), case.managers_name, "{}", case.name);
    }
}
