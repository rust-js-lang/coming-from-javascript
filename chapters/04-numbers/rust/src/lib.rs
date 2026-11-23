//! Chapter 4: numbers. JavaScript has one kind of number; Rust has a kind
//! for each job: whole or not, signed or not, and how big.

/// A bill split evenly, in cents: what each pays, and what's left over.
/// Dividing whole numbers gives a whole number, the rest is `%`.
pub fn split_bill(total_cents: u32, people: u32) -> (u32, u32) {
    (total_cents / people, total_cents % people)
}

/// The average score. Scores have fractions, so they're `f64`, and the
/// count, a `usize`, is turned into one with `as`.
pub fn average(scores: &[f64]) -> f64 {
    let mut sum = 0.0;
    for score in scores {
        sum += score;
    }
    sum / scores.len() as f64
}

/// What percent `part` is of `whole`, rounded to a whole number. Each
/// change of kind is written: whole to fraction, and back.
pub fn percent(part: u32, whole: u32) -> u32 {
    (part as f64 / whole as f64 * 100.0).round() as u32
}

/// The id after this one. A `u64` holds every whole number up to about 18
/// quintillion, exactly.
pub fn next_id(id: u64) -> u64 {
    id + 1
}

/// A game's lives: a `u8`, 0 to 255. `saturating_add` stops at 255
/// rather than going past what a `u8` holds.
pub fn add_lives(lives: u8, more: u8) -> u8 {
    lives.saturating_add(more)
}
