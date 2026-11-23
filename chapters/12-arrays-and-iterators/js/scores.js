// Chapter 12: arrays in JavaScript, beside `rust/src/lib.rs`'s `Vec`s,
// slices and iterators.

// The three best scores, best first. `sort()` sorts the caller's own array,
// in place, and as strings: 100 comes before 9.
export const topThree = (scores) => scores.sort().reverse().slice(0, 3)

// The same, copying first and comparing numbers.
export const topThreeCopied = (scores) => [...scores].sort((a, b) => b - a).slice(0, 3)

// The names of those who scored 50 or more: `filter` makes one array, `map` another.
export const passed = (students) => students.filter((s) => s.score >= 50).map((s) => s.name)

// The first who scored under 50, if any.
export const firstFailing = (students) => students.find((s) => s.score < 50)?.name

// The highest score. Of no scores, Math.max gives -Infinity.
export const highest = (scores) => Math.max(...scores)

// The score at a place in the list: past the end, undefined.
export const scoreAt = (scores, i) => scores[i]
