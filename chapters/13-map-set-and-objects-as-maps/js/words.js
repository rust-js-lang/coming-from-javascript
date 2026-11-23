// Chapter 13: counting words in JavaScript, with a plain object and with a
// `Map`, beside `rust/src/lib.rs`'s `HashMap`.

// How many times each word appears, kept in a plain object. Every object
// already has properties, `constructor` and `toString` among them, so
// counting those words starts from a function, and `+ 1` joins text to it.
export function wordCountsObject(text) {
  const counts = {}
  for (const word of text.toLowerCase().split(/\s+/).filter(Boolean)) {
    counts[word] = (counts[word] || 0) + 1
  }
  return counts
}

// The same with a `Map`, which has only the keys put in it.
export function wordCounts(text) {
  const counts = new Map()
  for (const word of text.toLowerCase().split(/\s+/).filter(Boolean)) {
    counts.set(word, (counts.get(word) ?? 0) + 1)
  }
  return counts
}

// The counts in alphabetical order.
export const sortedCounts = (text) =>
  [...wordCounts(text)].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))

// The words two texts share, in alphabetical order.
export function sharedWords(a, b) {
  const other = new Set(wordCounts(b).keys())
  return [...wordCounts(a).keys()].filter((word) => other.has(word)).sort()
}
