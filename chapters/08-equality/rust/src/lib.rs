//! Chapter 8: equality. `==` compares what's in two values, and only two
//! values of the same type; a type that can be compared or ordered says
//! so with `#[derive(..)]`.

/// A point. `PartialEq` gives it `==`, field by field.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Point {
    pub x: i32,
    pub y: i32,
}

/// Whether two points are the same point: the same `x` and the same `y`.
pub fn same_point(a: &Point, b: &Point) -> bool {
    a == b
}

/// Whether a list of points has this one: `contains` uses `==`.
pub fn contains_point(points: &[Point], point: &Point) -> bool {
    points.contains(point)
}

/// The points without repeats, the first of each kept.
pub fn unique_points(points: &[Point]) -> Vec<Point> {
    let mut unique: Vec<Point> = Vec::new();
    for point in points {
        if !unique.contains(point) {
            unique.push(*point);
        }
    }
    unique
}

/// A version number. `PartialOrd` and `Ord` order versions by their
/// fields, in the order they're written: major, then minor, then patch.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub struct Version {
    pub major: u32,
    pub minor: u32,
    pub patch: u32,
}

/// A version written `1.10.0`. Parts that aren't numbers are 0.
pub fn parse_version(text: &str) -> Version {
    let mut parts = text.split('.').map(|part| part.parse().unwrap_or(0));
    Version {
        major: parts.next().unwrap_or(0),
        minor: parts.next().unwrap_or(0),
        patch: parts.next().unwrap_or(0),
    }
}

/// Version numbers, oldest first: each parsed, sorted by its order, and
/// written back.
pub fn sort_versions(versions: &[&str]) -> Vec<String> {
    let mut parsed: Vec<Version> = versions.iter().map(|text| parse_version(text)).collect();
    parsed.sort();
    parsed.iter().map(|v| format!("{}.{}.{}", v.major, v.minor, v.patch)).collect()
}
