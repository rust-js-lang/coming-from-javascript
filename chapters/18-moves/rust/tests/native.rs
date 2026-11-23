//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_18_moves::{Score, add_goal, line_up, start_match, two_matches};
use serde::Deserialize;

#[derive(Deserialize)]
struct Cases {
    line_ups: Vec<(Vec<String>, String)>,
    goals: Vec<((u32, u32), bool, (u32, u32))>,
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Cases = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for (players, said) in cases.line_ups {
        assert_eq!(line_up(&start_match(players)), said);
    }
    for ((home, away), at_home, (h, a)) in cases.goals {
        let before = Score { home, away };
        let after = add_goal(before, at_home);
        assert_eq!(after, Score { home: h, away: a });
        // `before` was copied in: it's still here, as it was.
        assert_eq!(before, Score { home, away });
    }
}

#[test]
fn two_matches_are_two() {
    let players = vec!["ann".to_string(), "bo".to_string()];
    let (mut first, second) = two_matches(players);
    first.players.push("sub".to_string());
    assert_eq!((first.players.len(), second.players.len()), (3, 2));
}
