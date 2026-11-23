//! Chapter 2: types are checked before it runs. Every value has a type,
//! and the compiler checks every use of it against that type before the
//! program runs at all.

/// A user: a name, which is text, and an age, a whole number.
#[derive(Debug, Clone, PartialEq)]
pub struct User {
    pub name: String,
    pub age: u32,
}

/// A greeting for a user. `user.nmae` here wouldn't compile: `User` has
/// no field of that name.
pub fn greet(user: &User) -> String {
    format!("Hello, {}!", user.name)
}

/// One more of an item. `current` is a number, so `+ 1` adds; text can't
/// be given here at all.
pub fn next_quantity(current: u32) -> u32 {
    current + 1
}

/// A quantity typed into a form, as a number: 0 if it isn't one. Turning
/// text into a number is a step you write, `parse`, never a side effect of
/// `+`.
pub fn parse_quantity(text: &str) -> u32 {
    text.trim().parse().unwrap_or(0)
}

/// "1 item", "3 items".
pub fn items_label(count: u32) -> String {
    if count == 1 {
        "1 item".to_string()
    } else {
        format!("{count} items")
    }
}
