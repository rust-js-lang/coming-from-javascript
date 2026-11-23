// Chapter 5: text in JavaScript, where a string is a list of UTF-16
// units, and `length`, `slice` and `[i]` count those, not characters.

// How many characters: `length` counts UTF-16 units, so an emoji is 2.
export const charCount = (text) => text.length

// How many bytes the text takes as UTF-8, in a file or over the network.
export const byteSize = (text) => new TextEncoder().encode(text).length

// At most `max` characters, and "…" if anything was cut. `slice` cuts
// between UTF-16 units, so it can cut an emoji in half.
export function truncate(text, max) {
  return text.length <= max ? text : text.slice(0, max) + '…'
}

// The text backwards. `split('')` splits into UTF-16 units, and reversing
// those breaks an emoji's two halves apart.
export const reverse = (text) => text.split('').reverse().join('')

// The word with its first letter in capitals.
export const capitalize = (word) => (word === '' ? '' : word[0].toUpperCase() + word.slice(1))

// "Hi Ada, Grace and Linus!": a greeting built up piece by piece.
export function greetAll(names) {
  let greeting = 'Hi'
  names.forEach((name, i) => {
    greeting += i === 0 ? ' ' : i === names.length - 1 ? ' and ' : ', '
    greeting += name
  })
  return greeting + '!'
}
