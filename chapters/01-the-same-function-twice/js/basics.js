// Chapter 1: three small functions in JavaScript. rust/src/lib.rs has the
// same three in Rust.

// FizzBuzz: "Fizz" for multiples of 3, "Buzz" for 5, both for 15.
export function fizzbuzz(n) {
  if (n % 15 === 0) return 'FizzBuzz'
  if (n % 3 === 0) return 'Fizz'
  if (n % 5 === 0) return 'Buzz'
  return String(n)
}

// What a basket of prices adds up to.
export function total(prices) {
  let sum = 0
  for (const price of prices) {
    sum += price
  }
  return sum
}

// The first letter of each word, in capitals: "ada lovelace" is "AL".
export function initials(name) {
  return name
    .split(' ')
    .filter((word) => word !== '')
    .map((word) => word[0].toUpperCase())
    .join('')
}
