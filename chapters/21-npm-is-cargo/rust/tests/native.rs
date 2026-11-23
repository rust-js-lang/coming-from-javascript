//! The chapter's cases, run by native Rust: what rust-js's JS must say too.
//! From here, outside the crate, `Post` is at the crate's root, where `pub
//! use` put it, and `posts` is a public module.

use chapter_21_npm_is_cargo::Post;
use chapter_21_npm_is_cargo::posts::index;
use serde::Deserialize;

#[derive(Deserialize)]
struct Case {
    posts: Vec<(String, usize)>,
    index: Vec<String>,
}

/// A post of `title` whose body is `words` words long.
pub fn post(title: &str, words: usize) -> Post {
    Post { title: title.to_string(), body: vec!["word"; words].join(" ") }
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Vec<Case> = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for case in cases {
        let posts: Vec<Post> = case.posts.iter().map(|(title, words)| post(title, *words)).collect();
        assert_eq!(index(&posts), case.index);
    }
}
