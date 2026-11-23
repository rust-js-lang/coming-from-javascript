// Chapter 3: `let` and `const` in JavaScript, beside `rust/src/lib.rs`'s
// `let` and `let mut`.

// The most tags a post may have.
export const MAX_TAGS = 3

// A title as a URL slug: "  Hello World " is "hello-world". `let` lets
// one name be given a new value at each step.
export function slugify(title) {
  let slug = title.trim()
  slug = slug.toLowerCase()
  slug = slug.split(/\s+/).join('-')
  return slug
}

// The numbers from `from` down to 1.
export function countdown(from) {
  const numbers = []
  for (let n = from; n > 0; n--) {
    numbers.push(n)
  }
  return numbers
}

// Settings with a bigger font, as a new object: the given one is left as it was.
export function bigger(settings) {
  return { ...settings, fontSize: settings.fontSize + 2 }
}

// The same, changing the settings it's given. Nothing at the call says so,
// and `const` at the caller doesn't stop it.
export function enlarge(settings) {
  settings.fontSize += 2
}

// Adds a tag, if there's room: whether it did.
export function addTag(tags, tag) {
  if (tags.length >= MAX_TAGS) return false
  tags.push(tag)
  return true
}
