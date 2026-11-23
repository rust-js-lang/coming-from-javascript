// Chapter 24: JavaScript the Rust calls. `Intl.RelativeTimeFormat` knows
// how every language says "3 hours ago"; the Rust uses it rather than redo it.

// How long ago `seconds` ago was, in words: "3 hours ago", "yesterday".
export function relativeTime(seconds) {
  const format = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  const steps = [
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ]
  for (const [unit, size] of steps) {
    if (seconds >= size) return format.format(-Math.floor(seconds / size), unit)
  }
  return format.format(-seconds, 'second')
}

// The same feed in JavaScript, for comparing.
export const feed = (events, now, keep = () => true) =>
  events.filter(keep).map((e) => `${e.who} ${e.did}, ${relativeTime(now - e.at)}`)

// A greeting, with a default: JavaScript's default parameters.
export const greet = (name, greeting = 'Hello') => `${greeting}, ${name}!`
