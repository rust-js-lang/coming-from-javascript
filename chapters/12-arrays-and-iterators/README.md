# 12. Arrays and iterators

## The array methods you know

`filter`, `map`, `find`, `sort`, `Math.max`: JavaScript's arrays have a
method for everything. A few of them have sharp edges:

```js
// js/scores.js
export const topThree = (scores) => scores.sort().reverse().slice(0, 3)
export const highest = (scores) => Math.max(...scores)
export const scoreAt = (scores, i) => scores[i]
```

```
topThree([9, 100, 85, 10])
  js:   [9,85,100], and the scores are now [9,85,100,10]
  rust: [100,85,10], and the scores are still [9,100,85,10]
highest([])        js: -Infinity   rust: undefined
```

- `sort()` with no comparator sorts as strings (chapter 8), so `9`
  beats `100`.
- `sort()` sorts *in place*: the caller's array is rearranged, though
  `topThree` looks like it only reads it.
- `Math.max()` of nothing is `-Infinity`, a number that flows on.
- An index past the end is `undefined`.

## `Vec`, slices, and who may change them

Rust has two everyday kinds of list:
- a **`Vec<T>`** owns its items, and can grow and shrink;
- a **slice `&[T]`** borrows someone else's items, to read.

A function that only reads takes a slice, and can't change it:

```rust
fn sort_them(scores: &[u32]) {
    scores.sort();
}
```

```
error[E0596]: cannot borrow `*scores` as mutable, as it is behind a `&` reference
```

So to sort, `top_three` makes a copy of its own, and the caller's list is
left alone:

```rust
// rust/src/lib.rs
pub fn top_three(scores: &[u32]) -> Vec<u32> {
    let mut sorted = scores.to_vec();
    sorted.sort_by(|a, b| b.cmp(a));
    sorted.truncate(3);
    sorted
}
```

`sort_by(|a, b| b.cmp(a))` sorts best first: `b.cmp(a)` compares the
numbers as numbers, the reverse of `a.cmp(b)`. (A `Vec<u32>`'s plain
`sort()` sorts numbers as numbers too. There's no string default.)

## Iterators

```rust
pub fn passed(students: &[Student]) -> Vec<String> {
    students.iter().filter(|s| s.score >= 50).map(|s| s.name.clone()).collect()
}
```

It reads like JavaScript's `filter(...).map(...)`, and it works
differently underneath. `.iter()` makes an *iterator*, something that
hands out one item at a time. `filter` and `map` don't run yet; they wrap
it. Nothing happens until `collect()` pulls each item through the whole
chain and builds the one `Vec` at the end. JavaScript's `filter` builds a
whole array, then `map` builds another.

That's also why `find` stops at the first match, and why a chain can be
cut short with `take(n)`.

## Answers that may be missing are `Option`s

```rust
pub fn highest(scores: &[u32]) -> Option<u32> {
    scores.iter().max().copied()
}

pub fn score_at(scores: &[u32], i: usize) -> Option<u32> {
    scores.get(i).copied()
}
```

The highest of no scores is `None` (chapter 10), not `-Infinity`. `get(i)`
gives `None` past the end. And `scores[i]` past the end doesn't give
`undefined`: it panics, right there:

```
index out of bounds: the len is 1 but the index is 5
```

Use `[i]` where a bad index would be a bug, and `get(i)` where it's an
answer.

## What rust-js writes

Where JavaScript's own methods give the same answer, rust-js writes them:

```js
// rust/src/lib.js (generated)
export function topThree(scores) {
  const sorted = scores.slice();
  sorted.sort((a, b) => $cmp(b, a));
  $truncate(sorted, 3);
  return sorted;
}

export function passed(students) {
  return students.filter((s) => s.score >= 50).map((s) => s.name);
}

export function firstFailing(students) {
  return students.find((s) => s.score < 50)?.name;
}
```

`scores.slice()` is the copy, and `$cmp` compares numbers as numbers.
The `.d.ts` says `topThree(scores: readonly number[])`, so your editor
knows the function won't change your array.

## Where it's different

- **Closures are `|x| …`.** `|s| s.score >= 50` is `(s) => s.score >= 50`.
- **`collect` needs to know what to build.** A `Vec`, a `String`, a
  `HashMap` (chapter 13): the function's return type usually tells it.
- **`.iter()` borrows, `.into_iter()` takes.** `.iter()` lends each item
  and leaves the `Vec` as it was; `.into_iter()` uses the `Vec` up
  (chapter 18).

## Try it

Change `top_three` to sort `scores` itself, `scores.sort()`, and run
`cargo build`: E0596, a borrowed slice can't be changed. Then in
JavaScript, call `topThree` on an array and log the array afterwards.
