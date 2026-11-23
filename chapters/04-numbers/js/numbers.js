// Chapter 4: numbers in JavaScript, where every number is one kind, a
// 64-bit float, beside `rust/src/lib.rs`'s many.

// A bill split evenly, in cents: what each pays, and what's left over.
// Every number is a float, so whole numbers need Math.floor.
export function splitBill(totalCents, people) {
  return [Math.floor(totalCents / people), totalCents % people]
}

// The average score.
export function average(scores) {
  let sum = 0
  for (const score of scores) sum += score
  return sum / scores.length
}

// What percent `part` is of `whole`, rounded to a whole number.
export function percent(part, whole) {
  return Math.round((part / whole) * 100)
}

// The id after this one. Past 2 ** 53 a float can't hold every whole
// number, and the next one rounds back to this one.
export function nextId(id) {
  return id + 1
}

// A game's lives, which can't go past 255.
export function addLives(lives, more) {
  return Math.min(lives + more, 255)
}
