# 13. `Map`, `Set`, and objects as maps

## A plain object isn't empty

JavaScript code has long used plain objects as dictionaries: `{}` and
`counts[word]`. It mostly works, until a key happens to be a name every
object already has:

```js
// js/words.js
export function wordCountsObject(text) {
  const counts = {}
  for (const word of text.toLowerCase().split(/\s+/).filter(Boolean)) {
    counts[word] = (counts[word] || 0) + 1
  }
  return counts
}
```

```
counting "The constructor of the toString"
  js, a plain object: {"the":2,"constructor":"function Object() { [native code] }1","of":1,"tostring":1}
```

Every object inherits `constructor`, a function. So `counts['constructor']`
starts as that function, `|| 0` keeps it, and `+ 1` turns it into text.
Object keys have another surprise: they're always strings, so
`prices[1]` and `prices['1']` are the same key.

`Map` fixes both. It has only the keys you put in, of any type, and
`Set` is its keys-only cousin. Modern JavaScript code should use them,
and the `Map` version gives the right counts.

## Rust: `HashMap` and `HashSet`

Rust has no "object as dictionary". A map is a `HashMap<K, V>`, with one
type of key and one type of value:

```rust
// rust/src/lib.rs
pub fn word_counts(text: &str) -> HashMap<String, u32> {
    let mut counts = HashMap::new();
    for word in text.split_whitespace() {
        *counts.entry(word.to_lowercase()).or_insert(0) += 1;
    }
    counts
}
```

- **Only the keys you put in.** A new `HashMap` is empty: no
  `constructor`, nothing inherited.
- **One key type.** A `HashMap<u32, String>`'s keys are numbers. Insert
  the text `"1"` and it doesn't compile:
  ```
  error[E0308]: mismatched types
      expected `u32`, found `&str`
  ```
- **`entry`** finds a key's slot, filled or not; `or_insert(0)` fills an
  empty one. Counting is one line, without the `get`, default, `set`
  dance.

## Order: none, unless you ask

A JavaScript `Map` remembers the order keys were added. A Rust `HashMap`
doesn't: its order comes from hashing, and changes from run to run. When
order matters, ask for one. A `BTreeMap` keeps its keys sorted, always:

```rust
pub fn sorted_counts(text: &str) -> Vec<(String, u32)> {
    let sorted: BTreeMap<String, u32> = word_counts(text).into_iter().collect();
    sorted.into_iter().collect()
}
```

And a `HashSet` does set things built in, `intersection`, `union`,
`difference`:

```rust
pub fn shared_words(a: &str, b: &str) -> Vec<String> {
    let a: HashSet<String> = word_counts(a).into_keys().collect();
    let b: HashSet<String> = word_counts(b).into_keys().collect();
    let mut shared: Vec<String> = a.intersection(&b).cloned().collect();
    shared.sort();
    shared
}
```

## What rust-js writes

A `HashMap` is a JavaScript `Map` and a `HashSet` a `Set`, so your
JavaScript gets the types it would have chosen:

```js
// rust/src/lib.js (generated)
export function wordCounts(text) {
  const counts = new Map();
  for (const word of $splitWhitespace(text)) {
    const key = $toLowercase(word);
    const current = $orInsert(counts, key, 0);
    counts.set(key, (current + 1) >>> 0);
  }
  return counts;
}
```

```ts
// rust/src/lib.d.ts (generated)
export function wordCounts(text: string): Map<string, number>;
```

rust-js's `HashMap` is a JavaScript `Map`, so it happens to keep the order
keys were added. Native Rust's doesn't, so don't count on it:
`compare.test.js` sorts before it compares.

## Where it's different

- **Tuples.** `(String, u32)` is two values together, an array of two in
  JavaScript, `["the", 2]`, as `Object.entries` gives.
- **Missing keys are `Option`s.** `counts.get("the")` is `Option<&u32>`
  (chapter 10); `counts["the"]` panics if the key is missing. There's no
  `undefined` to add 1 to.
- **A struct as a key.** Any type that derives `Eq` and `Hash` can be a
  key, a `Point` included, compared by what's in it (chapter 8). A
  JavaScript `Map` with object keys compares them by identity.

## Try it

In a test, make a `HashMap<u32, String>` and `insert("1", ...)`: E0308,
the key must be a number. Then in JavaScript, count the words of `"the
constructor"` with `wordCountsObject` and log `counts.constructor`.
