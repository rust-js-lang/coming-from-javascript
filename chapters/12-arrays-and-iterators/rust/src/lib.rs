//! Chapter 12: arrays and iterators. A `Vec` owns its items, a slice `&[T]`
//! borrows them, and an iterator walks them a step at a time, only as far
//! as something asks.

/// A student and their score.
#[derive(Debug, Clone, PartialEq)]
pub struct Student {
    pub name: String,
    pub score: u32,
}

/// The three best scores, best first. The scores are borrowed to read, so
/// sorting needs a copy of its own: the caller's list can't be changed.
pub fn top_three(scores: &[u32]) -> Vec<u32> {
    let mut sorted = scores.to_vec();
    sorted.sort_by(|a, b| b.cmp(a));
    sorted.truncate(3);
    sorted
}

/// The names of those who scored 50 or more. The chain builds nothing in
/// between: `collect` makes the one `Vec` at the end.
pub fn passed(students: &[Student]) -> Vec<String> {
    students.iter().filter(|s| s.score >= 50).map(|s| s.name.clone()).collect()
}

/// The first who scored under 50, if any. `find` stops at the first.
pub fn first_failing(students: &[Student]) -> Option<String> {
    students.iter().find(|s| s.score < 50).map(|s| s.name.clone())
}

/// The highest score, if there are any: `max` of nothing is `None`.
pub fn highest(scores: &[u32]) -> Option<u32> {
    scores.iter().max().copied()
}

/// The score at a place in the list, if there's one there. `get` gives an
/// `Option`; `scores[i]` past the end would panic.
pub fn score_at(scores: &[u32], i: usize) -> Option<u32> {
    scores.get(i).copied()
}
