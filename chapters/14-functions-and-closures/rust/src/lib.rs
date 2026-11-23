//! Chapter 14: functions and closures. A closure is `|x| ...`; it borrows
//! or takes what it uses, and its type says whether it changes anything:
//! `Fn` only reads, `FnMut` changes what it holds.

/// A function that adds `n` to what it's given. `move` makes the closure
/// take its own `n`, as it outlives this call; `impl Fn(i32) -> i32` is
/// "some function from an `i32` to an `i32`".
pub fn adder(n: i32) -> impl Fn(i32) -> i32 {
    move |x| x + n
}

/// Adders for 0, 1 .. `count`, each called with 10. Each pass of the loop
/// has its own `i`, and each closure takes its own copy.
pub fn adders(count: i32) -> Vec<i32> {
    let mut made = Vec::new();
    for i in 0..count {
        made.push(move |x: i32| x + i);
    }
    made.iter().map(|add| add(10)).collect()
}

/// A counter: each call gives the next number. The closure changes the
/// `n` it holds, so it's an `FnMut`.
pub fn counter() -> impl FnMut() -> u32 {
    let mut n = 0;
    move || {
        n += 1;
        n
    }
}

/// `f` applied to `x` twice: a function taken as a parameter.
pub fn apply_twice(f: impl Fn(i32) -> i32, x: i32) -> i32 {
    f(f(x))
}

/// Ten applied twice to each adder: the functions as values, kept in a list.
pub fn twice_each(ns: &[i32]) -> Vec<i32> {
    ns.iter().map(|&n| apply_twice(adder(n), 10)).collect()
}
