//! Chapter 18: moves. Every value has one owner. Giving it to a function
//! that takes it moves it, and the old name can't be used again.

/// A match: its players, and how many it started with.
#[derive(Debug, Clone, PartialEq)]
pub struct Match {
    pub players: Vec<String>,
    pub size: usize,
}

/// A match starts with its players. It takes them: after this, the
/// caller's `players` is gone, so nothing else can change the line-up.
pub fn start_match(players: Vec<String>) -> Match {
    let size = players.len();
    Match { players, size }
}

/// Two matches of the same players: the first gets its own copy, a
/// `clone`, and the second takes the players themselves.
pub fn two_matches(players: Vec<String>) -> (Match, Match) {
    let first = start_match(players.clone());
    let second = start_match(players);
    (first, second)
}

/// A score: two small numbers, cheap to copy. `Copy` makes passing one a
/// copy, and the old name stays usable.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Score {
    pub home: u32,
    pub away: u32,
}

/// A score after a goal. `score` was copied in, so the caller still has
/// the one from before.
pub fn add_goal(score: Score, home: bool) -> Score {
    if home {
        Score { home: score.home + 1, ..score }
    } else {
        Score { away: score.away + 1, ..score }
    }
}

/// The match's line-up, and whether it's still the size it started.
pub fn line_up(game: &Match) -> String {
    let full = if game.players.len() == game.size { "full" } else { "changed!" };
    format!("{} ({full})", game.players.join(", "))
}
