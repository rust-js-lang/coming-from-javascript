//! Chapter 1: the same three functions as `js/basics.js`, in Rust.

/// FizzBuzz: "Fizz" for multiples of 3, "Buzz" for 5, both for 15.
pub fn fizzbuzz(n: u32) -> String {
    if n % 15 == 0 {
        return "FizzBuzz".to_string();
    }
    if n % 3 == 0 {
        return "Fizz".to_string();
    }
    if n % 5 == 0 {
        return "Buzz".to_string();
    }
    n.to_string()
}

/// What a basket of prices adds up to.
pub fn total(prices: &[f64]) -> f64 {
    let mut sum = 0.0;
    for price in prices {
        sum += price;
    }
    sum
}

/// The first letter of each word, in capitals: "ada lovelace" is "AL".
pub fn initials(name: &str) -> String {
    name.split(' ')
        .filter(|word| !word.is_empty())
        .map(|word| word.chars().next().unwrap().to_uppercase().to_string())
        .collect()
}
