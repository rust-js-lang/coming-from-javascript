//! Chapter 6: everything is an expression. `if`, `match` and a block give
//! back a value, so a variable is given its value once, where it's made.

/// Shipping: free from $50, else $5, or $10 under $20. The `if` is the
/// value: no variable declared first and assigned later.
pub fn shipping(total_cents: u32) -> u32 {
    if total_cents >= 5000 {
        0
    } else if total_cents >= 2000 {
        500
    } else {
        1000
    }
}

/// A letter grade for a score out of 100. A `match` on ranges, each arm a
/// value.
pub fn grade(score: u32) -> char {
    match score {
        90.. => 'A',
        80..=89 => 'B',
        70..=79 => 'C',
        _ => 'F',
    }
}

/// What kind of day it is. A `match` arm never falls into the next one:
/// there's no `break` to forget.
pub fn day_kind(day: &str) -> &'static str {
    match day {
        "sat" | "sun" => "weekend",
        "fri" => "almost weekend",
        "mon" | "tue" | "wed" | "thu" => "weekday",
        _ => "not a day",
    }
}

/// How many steps from n to 1, halving when even, 3n + 1 when odd. A
/// `loop` gives back the value its `break` carries.
pub fn steps_to_one(start: u64) -> u32 {
    let mut n = start;
    let mut steps = 0;
    loop {
        if n == 1 {
            break steps;
        }
        n = if n % 2 == 0 { n / 2 } else { 3 * n + 1 };
        steps += 1;
    }
}
