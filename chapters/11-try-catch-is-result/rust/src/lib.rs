//! Chapter 11: `try`/`catch` is `Result`. A function that can fail returns
//! `Result<T, E>`, `Ok(value)` or `Err(why)`, and its first line says so.

use std::fmt;

/// A sign-up form, as it was typed.
#[derive(Debug, Clone, PartialEq)]
pub struct Form {
    pub email: String,
    pub password: String,
    pub age: String,
}

/// An account, once the form checks out.
#[derive(Debug, Clone, PartialEq)]
pub struct Account {
    pub email: String,
    pub age: u8,
}

/// Every way the form can be wrong: a value, not a message, so code can
/// tell them apart.
#[derive(Debug, Clone, PartialEq)]
#[cfg_attr(rust_js, rust_js::tag = "problem")]
pub enum SignUpError {
    #[cfg_attr(rust_js, rust_js::name = "no-email")]
    NoEmail,
    #[cfg_attr(rust_js, rust_js::name = "bad-email")]
    BadEmail { email: String },
    #[cfg_attr(rust_js, rust_js::name = "short-password")]
    ShortPassword { min: usize },
    #[cfg_attr(rust_js, rust_js::name = "bad-age")]
    BadAge { why: String },
}

/// Each problem in words, for the page.
impl fmt::Display for SignUpError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            SignUpError::NoEmail => write!(f, "an email is needed"),
            SignUpError::BadEmail { email } => write!(f, "{email:?} isn't an email"),
            SignUpError::ShortPassword { min } => write!(f, "the password needs at least {min} characters"),
            SignUpError::BadAge { why } => write!(f, "{why}"),
        }
    }
}

/// An age typed into the form, or why it isn't one.
pub fn parse_age(text: &str) -> Result<u8, String> {
    let age: u8 = text.trim().parse().map_err(|_| format!("{text:?} isn't an age"))?;
    if !(13..=120).contains(&age) {
        return Err(format!("{age} is out of range"));
    }
    Ok(age)
}

/// The form checked: an account, or the first problem. Each `?` returns
/// the problem from here at once.
pub fn sign_up(form: &Form) -> Result<Account, SignUpError> {
    let email = form.email.trim();
    if email.is_empty() {
        return Err(SignUpError::NoEmail);
    }
    if !email.contains('@') {
        return Err(SignUpError::BadEmail { email: email.to_string() });
    }
    if form.password.chars().count() < 8 {
        return Err(SignUpError::ShortPassword { min: 8 });
    }
    let age = parse_age(&form.age).map_err(|why| SignUpError::BadAge { why })?;
    Ok(Account { email: email.to_string(), age })
}

/// What the page shows: the account's email, or the problem. A `match`
/// on the `Result`, where JavaScript has `try`/`catch`.
pub fn message(form: &Form) -> String {
    match sign_up(form) {
        Ok(account) => format!("welcome, {}", account.email),
        Err(problem) => format!("sorry: {problem}"),
    }
}
