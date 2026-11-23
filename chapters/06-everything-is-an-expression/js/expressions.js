// Chapter 6: JavaScript's statements, where `if` and `switch` do things
// but give back nothing, beside `rust/src/lib.rs`'s expressions.

// Shipping: free from $50, else $5, or $10 under $20. A `let` declared
// first, then assigned in each branch.
export function shipping(totalCents) {
  let cents
  if (totalCents >= 5000) {
    cents = 0
  } else if (totalCents >= 2000) {
    cents = 500
  } else {
    cents = 1000
  }
  return cents
}

// A letter grade for a score out of 100.
export function grade(score) {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  return 'F'
}

// What kind of day it is. `switch` falls through to the next `case`
// unless each one says `break`.
export function dayKind(day) {
  let kind
  switch (day) {
    case 'sat':
    case 'sun':
      kind = 'weekend'
      break
    case 'fri':
      kind = 'almost weekend'
    // a `break` forgotten here: friday falls through to the next case
    case 'mon':
    case 'tue':
    case 'wed':
    case 'thu':
      kind = 'weekday'
      break
    default:
      kind = 'not a day'
  }
  return kind
}

// How many steps from n to 1, halving when even, 3n + 1 when odd.
export function stepsToOne(n) {
  let steps = 0
  while (n !== 1) {
    n = n % 2 === 0 ? n / 2 : 3 * n + 1
    steps += 1
  }
  return steps
}
