//! Chapter 13: `Map`, `Set`, and objects as maps. A `HashMap` holds only
//! the keys put in it, each of one type; `entry` finds a key's slot; a
//! `BTreeMap` keeps its keys in order, and a `HashSet` is a `Set`.

use std::collections::{BTreeMap, HashMap, HashSet};

/// How many times each word appears.
pub fn word_counts(text: &str) -> HashMap<String, u32> {
    let mut counts = HashMap::new();
    for word in text.split_whitespace() {
        *counts.entry(word.to_lowercase()).or_insert(0) += 1;
    }
    counts
}

/// The counts in alphabetical order: a `BTreeMap` keeps its keys sorted.
pub fn sorted_counts(text: &str) -> Vec<(String, u32)> {
    let sorted: BTreeMap<String, u32> = word_counts(text).into_iter().collect();
    sorted.into_iter().collect()
}

/// The words two texts share, in alphabetical order.
pub fn shared_words(a: &str, b: &str) -> Vec<String> {
    let a: HashSet<String> = word_counts(a).into_keys().collect();
    let b: HashSet<String> = word_counts(b).into_keys().collect();
    let mut shared: Vec<String> = a.intersection(&b).cloned().collect();
    shared.sort();
    shared
}
