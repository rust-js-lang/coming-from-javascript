# 8. Equality

## Two questions JavaScript asks with one operator

`===` on numbers and strings asks "the same value?". On objects and
arrays it asks something else: "*the same object*?". Two points made
apart are never `===`, however alike:

```js
// js/equality.js
export const samePoint = (a, b) => a === b
export const containsPoint = (points, point) => points.includes(point)
export const uniquePoints = (points) => [...new Set(points)]
```

```
samePoint({x:1,y:2}, {x:1,y:2})   js: false   rust: true
containsPoint(walk, {x:1,y:0})    js: false   rust: true
uniquePoints(walk).length          js: 3       rust: 2
```

`includes` and `Set` use the same identity test, so a point in the list
isn't found unless you hold that very object, and a `Set` keeps two
`{x: 0, y: 0}`s. The usual workarounds are comparing each field by hand,
or turning objects into strings with `JSON.stringify`.

And then there's `==`, which first converts values to a common type:
`0 == ''`, `'1' == 1` and `null == undefined` are all `true`. Most style
guides ban it.

## Rust's `==` compares what's inside

In Rust, `==` always asks "do these hold the same value?", for numbers,
strings, lists and structs alike. A struct gets `==` by asking for it:

```rust
// rust/src/lib.rs
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Point {
    pub x: i32,
    pub y: i32,
}

pub fn same_point(a: &Point, b: &Point) -> bool {
    a == b
}

pub fn contains_point(points: &[Point], point: &Point) -> bool {
    points.contains(point)
}
```

`#[derive(PartialEq)]` tells the compiler to write `==` for `Point`:
equal when every field is equal. `contains` uses `==`, so it finds a
point by what's in it. Without the derive, `Point` can't be compared at
all:

```
error[E0369]: binary operation `==` cannot be applied to type `&Point`
```

And `==` only compares two values of the *same* type. There's no
`'1' == 1` to get wrong:

```rust
let n: u32 = 1;
n == "1"
```

```
error[E0308]: mismatched types
```

## Order is asked for too

JavaScript's `sort()`, given no comparator, turns everything into
strings and sorts those, so `"1.10.0"` comes before `"1.9.3"`:

```
sort ["1.10.0","1.2.0","1.9.3"]
  js:   ["1.10.0","1.2.0","1.9.3"]
  rust: ["1.2.0","1.9.3","1.10.0"]
```

A Rust struct gets an order by deriving `PartialOrd` and `Ord`:
compared field by field, in the order the fields are written:

```rust
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub struct Version {
    pub major: u32,
    pub minor: u32,
    pub patch: u32,
}
```

Then `versions.sort()` sorts by major, then minor, then patch. There's no
string-sorting default to fall into: `sort()` on a type with no order
doesn't compile.

## What rust-js writes

`==` on structs becomes `$eq`, rust-js's field-by-field comparison, and
the derived order becomes the comparator you'd write by hand:

```js
// rust/src/lib.js (generated)
export function containsPoint(points, point) {
  return points.some((each) => $eq(each, point));
}

export function sortVersions(versions) {
  const parsed = versions.map(parseVersion);
  parsed.sort((a, b) => $cmp(a.major, b.major) || $cmp(a.minor, b.minor) || $cmp(a.patch, b.patch));
  return parsed.map((v) => `${v.major}.${v.minor}.${v.patch}`);
}
```

## Where it's different

- **`PartialEq` and `Eq`.** Floats have NaN, which isn't equal to itself
  in Rust either, so `f64` is only `PartialEq`. Types where every value
  equals itself are also `Eq`, and only those can be `HashMap` keys
  (chapter 13) or sorted with `sort()`.
- **No identity check by default.** When you really need "the same
  object", `std::ptr::eq` asks it. It's rare: in Rust, two values that
  hold the same thing are the same answer.

## Try it

Remove `PartialEq` from `Point`'s derive and run `cargo build`. Rust
lists each place that compared points: E0369 for `a == b`, and E0277 for
`contains` and `unique_points`, "can't compare `Point` with `Point`".
Equality is something a type asks for.
