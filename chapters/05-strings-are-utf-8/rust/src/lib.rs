//! Chapter 5: strings are UTF-8. A `String` owns its text, a `&str` borrows
//! some; both are always valid UTF-8, and characters are asked for by
//! name, `chars()`, never by index.

/// How many characters: `chars()` walks whole characters.
pub fn char_count(text: &str) -> usize {
    text.chars().count()
}

/// How many bytes the text takes as UTF-8: a `str`'s `len()` is its bytes.
pub fn byte_size(text: &str) -> usize {
    text.len()
}

/// At most `max` characters, and "…" if anything was cut. `take(max)`
/// takes whole characters, so nothing is cut in half.
pub fn truncate(text: &str, max: usize) -> String {
    if text.chars().count() <= max {
        return text.to_string();
    }
    let mut short: String = text.chars().take(max).collect();
    short.push('…');
    short
}

/// The text backwards, character by character.
pub fn reverse(text: &str) -> String {
    text.chars().rev().collect()
}

/// The word with its first letter in capitals: the first character, and
/// the rest of the text after it.
pub fn capitalize(word: &str) -> String {
    let mut chars = word.chars();
    match chars.next() {
        Some(first) => first.to_uppercase().collect::<String>() + chars.as_str(),
        None => String::new(),
    }
}

/// "Hi Ada, Grace and Linus!": a `String` built up piece by piece, which
/// owns its text and can grow.
pub fn greet_all(names: &[&str]) -> String {
    let mut greeting = String::from("Hi");
    for (i, name) in names.iter().enumerate() {
        greeting.push_str(if i == 0 {
            " "
        } else if i == names.len() - 1 {
            " and "
        } else {
            ", "
        });
        greeting.push_str(name);
    }
    greeting.push('!');
    greeting
}
