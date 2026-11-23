//! Chapter 24: calling JavaScript, and where JavaScript is easier. A
//! binding declares a function JavaScript has; a closure parameter takes a
//! JavaScript function.

/// `relativeTime` of `js/time.js`, bound: rust-js writes the `import`, and
/// rustc checks each call against these types. Natively there's no
/// JavaScript to call, so its body is `unreachable!()`.
#[cfg_attr(rust_js, rust_js::link_name = "../../js/time.js#relativeTime")]
fn relative_time(seconds: u32) -> String {
    unreachable!("{seconds}: a binding runs only in JavaScript")
}

/// Something someone did, `at` seconds into the day.
#[derive(Debug, Clone, PartialEq)]
pub struct Event {
    pub who: String,
    pub did: String,
    pub at: u32,
}

/// The events kept by `keep`, newest last: plain Rust, the same natively
/// and in JavaScript. `keep` is any function, a JavaScript one too.
pub fn kept(events: &[Event], keep: impl Fn(&Event) -> bool) -> Vec<Event> {
    events.iter().filter(|e| keep(e)).cloned().collect()
}

/// The activity feed: each kept event, and how long ago, in JavaScript's
/// `Intl` words.
pub fn feed(events: &[Event], now: u32, keep: impl Fn(&Event) -> bool) -> Vec<String> {
    kept(events, keep)
        .iter()
        .map(|e| format!("{} {}, {}", e.who, e.did, relative_time(now - e.at)))
        .collect()
}

/// A greeting. Rust has no default parameters: a missing one is an
/// `Option`, and its default is written in the body.
pub fn greet(name: &str, greeting: Option<&str>) -> String {
    format!("{}, {name}!", greeting.unwrap_or("Hello"))
}
