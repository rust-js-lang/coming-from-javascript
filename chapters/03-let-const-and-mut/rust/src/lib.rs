//! Chapter 3: `let`, `const` and `mut`. A variable can't change unless it
//! says `mut`, and that covers what's inside it too; a function that
//! changes what it's given says `&mut`, and so does its caller.

/// The most tags a post may have: a `const`, fixed when the program is
/// compiled.
pub const MAX_TAGS: usize = 3;

/// A title as a URL slug: "  Hello World " is "hello-world". Each `let`
/// makes a new `slug`, shadowing the last: nothing is changed.
pub fn slugify(title: &str) -> String {
    let slug = title.trim();
    let slug = slug.to_lowercase();
    let slug: Vec<&str> = slug.split_whitespace().collect();
    slug.join("-")
}

/// The numbers from `from` down to 1. `n` and `numbers` change, so they
/// say `mut`.
pub fn countdown(from: u32) -> Vec<u32> {
    let mut numbers = Vec::new();
    let mut n = from;
    while n > 0 {
        numbers.push(n);
        n -= 1;
    }
    numbers
}

/// Settings for a reader.
#[derive(Debug, Clone, PartialEq)]
pub struct Settings {
    pub theme: String,
    pub font_size: u32,
}

/// Settings with a bigger font, as new settings. `&Settings` lends them to
/// read: this function can't change them.
pub fn bigger(settings: &Settings) -> Settings {
    Settings { font_size: settings.font_size + 2, ..settings.clone() }
}

/// The same, changing the settings it's given. `&mut` says so, here and
/// at every call: `enlarge(&mut settings)`.
pub fn enlarge(settings: &mut Settings) {
    settings.font_size += 2;
}

/// Adds a tag, if there's room: whether it did.
pub fn add_tag(tags: &mut Vec<String>, tag: &str) -> bool {
    if tags.len() >= MAX_TAGS {
        return false;
    }
    tags.push(tag.to_string());
    true
}
