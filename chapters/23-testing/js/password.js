// Chapter 23: the same checks in JavaScript, tested in password.test.js.

// How many kinds of character the password mixes. Not exported: the test
// file can't reach it.
function kinds(password) {
  return [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].filter((kind) => kind.test(password)).length
}

// How strong a password is: "weak", "okay" or "strong".
export function strength(password) {
  const length = [...password].length
  const k = kinds(password)
  if (length >= 12 && k >= 3) return 'strong'
  if (length >= 8 && k >= 2) return 'okay'
  return 'weak'
}

// The average score. Of no scores, 0 / 0: NaN, no error.
export const average = (scores) => Math.floor(scores.reduce((a, b) => a + b, 0) / scores.length)
