//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_11_try_catch_is_result::{Account, Form, SignUpError, message, sign_up};
use serde::{Deserialize, Serialize};

/// A problem as cases.json writes it, the JavaScript object rust-js makes.
#[derive(Serialize, Deserialize, Debug, PartialEq)]
#[serde(tag = "problem", rename_all = "kebab-case")]
pub enum Problem {
    NoEmail,
    BadEmail { email: String },
    ShortPassword { min: usize },
    BadAge { why: String },
}

/// What `sign_up` gives, as cases.json writes it.
#[derive(Serialize, Deserialize, Debug, PartialEq)]
pub enum Outcome {
    Ok { email: String, age: u8 },
    Err(Problem),
}

impl Outcome {
    pub fn of(result: Result<Account, SignUpError>) -> Outcome {
        match result {
            Ok(Account { email, age }) => Outcome::Ok { email, age },
            Err(SignUpError::NoEmail) => Outcome::Err(Problem::NoEmail),
            Err(SignUpError::BadEmail { email }) => Outcome::Err(Problem::BadEmail { email }),
            Err(SignUpError::ShortPassword { min }) => Outcome::Err(Problem::ShortPassword { min }),
            Err(SignUpError::BadAge { why }) => Outcome::Err(Problem::BadAge { why }),
        }
    }
}

#[derive(Deserialize)]
struct Case {
    form: (String, String, String),
    outcome: Outcome,
    message: String,
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Vec<Case> = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for case in cases {
        let (email, password, age) = case.form;
        let form = Form { email, password, age };
        assert_eq!(Outcome::of(sign_up(&form)), case.outcome, "{form:?}");
        assert_eq!(message(&form), case.message);
    }
}
