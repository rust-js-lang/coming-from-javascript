//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_03_let_const_and_mut::{Settings, add_tag, bigger, countdown, enlarge, slugify};
use serde::Deserialize;

#[derive(Deserialize)]
struct Cases {
    slugs: Vec<(String, String)>,
    countdowns: Vec<(u32, Vec<u32>)>,
    tags: Vec<(Vec<String>, Vec<bool>, Vec<String>)>,
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Cases = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for (title, slug) in &cases.slugs {
        assert_eq!(&slugify(title), slug);
    }
    for (from, numbers) in &cases.countdowns {
        assert_eq!(&countdown(*from), numbers);
    }
    // Each tag added in turn to an empty list: whether each went in, and the list after.
    for (adding, added, after) in &cases.tags {
        let mut tags = Vec::new();
        let went: Vec<bool> = adding.iter().map(|tag| add_tag(&mut tags, tag)).collect();
        assert_eq!((&went, &tags), (added, after));
    }
}

#[test]
fn bigger_makes_new_settings_and_enlarge_changes_them() {
    let mut settings = Settings { theme: "dark".to_string(), font_size: 14 };
    let larger = bigger(&settings);
    assert_eq!((settings.font_size, larger.font_size), (14, 16));
    enlarge(&mut settings);
    assert_eq!(settings.font_size, 16);
}
