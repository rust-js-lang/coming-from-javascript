// Chapter 2: a shopping cart in JavaScript, where a value's kind is found
// out as the program runs. rust/src/lib.rs has the same in Rust.

// A greeting for a user, `{ name, age }`.
export function greet(user) {
  return `Hello, ${user.name}!`
}

// The same, with the property name mistyped. Nothing complains: the
// missing property is `undefined`, and it's printed.
export function greetMistyped(user) {
  return `Hello, ${user.nmae}!`
}

// One more of an item. A quantity read from a form's <input> is a string,
// and `+` on a string joins: "2" + 1 is "21".
export function nextQuantity(current) {
  return current + 1
}

// A quantity typed into a form, as a number: 0 if it isn't one.
export function parseQuantity(text) {
  const n = Number.parseInt(text.trim(), 10)
  return Number.isNaN(n) || n < 0 ? 0 : n
}

// "1 item", "3 items".
export function itemsLabel(count) {
  return count === 1 ? '1 item' : `${count} items`
}
