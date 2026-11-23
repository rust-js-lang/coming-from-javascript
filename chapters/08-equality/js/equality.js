// Chapter 8: equality in JavaScript, where `===` on objects asks whether
// they're the same object, beside `rust/src/lib.rs`'s `==`.

// Whether two points are the same point.
export const samePoint = (a, b) => a === b

// Whether a list of points has this one: `includes` uses `===`.
export const containsPoint = (points, point) => points.includes(point)

// The points without repeats: a `Set` keeps objects apart by identity.
export const uniquePoints = (points) => [...new Set(points)]

// Version numbers, oldest first. `sort()` with no comparator sorts as
// strings: "1.10.0" comes before "1.9.0".
export const sortVersions = (versions) => [...versions].sort()

// The same, comparing the numbers.
export function sortVersionsNumerically(versions) {
  const parts = (v) => v.split('.').map(Number)
  return [...versions].sort((a, b) => {
    const [x, y] = [parts(a), parts(b)]
    for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] - y[i]
    return 0
  })
}
