//! Chapter 23: testing. Tests live beside the code, in a `#[cfg(test)]`
//! module that sees the file's private items; `cargo test` runs them
//! natively, and `rust-js test` runs the same tests as JavaScript.

/// How strong a password is: "weak", "okay" or "strong".
pub fn strength(password: &str) -> &'static str {
    let length = password.chars().count();
    match (length, kinds(password)) {
        (12.., 3..) => "strong",
        (8.., 2..) => "okay",
        _ => "weak",
    }
}

/// How many kinds of character the password mixes: lower case, upper case,
/// digits, anything else. Private to this file.
fn kinds(password: &str) -> u32 {
    let has = |test: fn(&char) -> bool| password.chars().any(|c| test(&c)) as u32;
    has(char::is_ascii_lowercase)
        + has(char::is_ascii_uppercase)
        + has(char::is_ascii_digit)
        + has(|c| !c.is_ascii_alphanumeric())
}

/// The average score. No scores is a bug in the caller: it panics.
pub fn average(scores: &[u32]) -> u32 {
    assert!(!scores.is_empty(), "no scores to average");
    scores.iter().sum::<u32>() / scores.len() as u32
}

// The unit tests: compiled only for `cargo test`, and able to reach
// `kinds`, which is private.
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn a_long_mixed_password_is_strong() {
        assert_eq!(strength("Correct-Horse-9"), "strong");
    }

    #[test]
    fn short_is_weak_however_mixed() {
        assert_eq!(strength("aB3$"), "weak");
    }

    #[test]
    fn a_private_helper_is_tested_from_its_own_file() {
        assert_eq!(kinds("abc"), 1);
        assert_eq!(kinds("aB3$"), 4);
    }

    // A test may return a `Result`: an `Err` fails it, and `?` works.
    #[test]
    fn a_test_can_use_question_mark() -> Result<(), std::num::ParseIntError> {
        let score: u32 = "42".parse()?;
        assert_eq!(average(&[score, 58]), 50);
        Ok(())
    }

    // A test that passes only if the code panics, with this in its message.
    #[test]
    #[should_panic(expected = "no scores")]
    fn averaging_nothing_panics() {
        average(&[]);
    }
}
