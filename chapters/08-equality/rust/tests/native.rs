//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_08_equality::{Point, contains_point, same_point, sort_versions, unique_points};
use serde::Deserialize;

#[derive(Deserialize)]
struct Cases {
    /// Two points, each `[x, y]`, and whether they're the same.
    pairs: Vec<([i32; 2], [i32; 2], bool)>,
    /// A walk's points, a point looked for, whether it's there, and the walk's unique points.
    walks: Vec<(Vec<[i32; 2]>, [i32; 2], bool, Vec<[i32; 2]>)>,
    versions: Vec<(Vec<String>, Vec<String>)>,
}

fn point([x, y]: [i32; 2]) -> Point {
    Point { x, y }
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Cases = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for (a, b, same) in cases.pairs {
        assert_eq!(same_point(&point(a), &point(b)), same);
    }
    for (walk, looked_for, there, unique) in cases.walks {
        let walk: Vec<Point> = walk.into_iter().map(point).collect();
        assert_eq!(contains_point(&walk, &point(looked_for)), there);
        assert_eq!(unique_points(&walk), unique.into_iter().map(point).collect::<Vec<_>>());
    }
    for (versions, sorted) in &cases.versions {
        let versions: Vec<&str> = versions.iter().map(String::as_str).collect();
        assert_eq!(&sort_versions(&versions), sorted);
    }
}
