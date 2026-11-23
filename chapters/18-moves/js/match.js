// Chapter 18: objects in JavaScript are shared: two names can reach the
// same array. Beside `rust/src/lib.rs`'s moves.

// A match starts with its players. It keeps the array it's given, the
// caller's own, which the caller can still change.
export function startMatch(players) {
  return { players, size: players.length }
}

// Two matches of the same players: the first gets a copy.
export const twoMatches = (players) => [startMatch([...players]), startMatch(players)]

// A score after a goal: numbers are copied when passed, so the old score
// is still there.
export const addGoal = (score, home) => (home ? { ...score, home: score.home + 1 } : { ...score, away: score.away + 1 })

// The match's line-up, and whether it's still the size it started.
export const lineUp = (match) => `${match.players.join(', ')} (${match.players.length === match.size ? 'full' : 'changed!'})`
