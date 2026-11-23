// Chapter 14: functions and closures in JavaScript, beside
// `rust/src/lib.rs`'s.

// A function that adds `n` to what it's given: a closure over `n`.
export const adder = (n) => (x) => x + n

// Adders for 0, 1 and 2, each called with 10. With `var`, every closure
// shares the one `i`, which is 3 by the time they're called.
export function addersWithVar(count) {
  const adders = []
  for (var i = 0; i < count; i++) adders.push((x) => x + i)
  return adders.map((add) => add(10))
}

// The same with `let`, a new `i` for each pass.
export function adders(count) {
  const made = []
  for (let i = 0; i < count; i++) made.push((x) => x + i)
  return made.map((add) => add(10))
}

// A counter: each call gives the next number. The closure keeps `n`.
export function counter() {
  let n = 0
  return () => {
    n += 1
    return n
  }
}

// `f` applied to `x` twice.
export const applyTwice = (f, x) => f(f(x))
