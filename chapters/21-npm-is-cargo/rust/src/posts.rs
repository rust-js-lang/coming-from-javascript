//! A blog's posts.

// `crate::` starts from this crate's root.
use crate::text::{kebab, words};

/// A post.
#[derive(Debug, Clone, PartialEq)]
pub struct Post {
    pub title: String,
    pub body: String,
}

impl Post {
    /// Its address: its title in kebab case.
    pub fn slug(&self) -> String {
        kebab(&self.title)
    }

    /// Minutes to read it, at 200 words a minute, at least 1.
    pub fn reading_minutes(&self) -> u32 {
        (words(&self.body) as u32).div_ceil(200).max(1)
    }
}

/// The blog's index: each post's slug and reading time.
pub fn index(posts: &[Post]) -> Vec<String> {
    posts.iter().map(|post| format!("/{} ({} min)", post.slug(), post.reading_minutes())).collect()
}
