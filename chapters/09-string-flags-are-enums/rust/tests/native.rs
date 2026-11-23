//! The chapter's cases, run by native Rust: what rust-js's JS must say too.

use chapter_09_string_flags_are_enums::{Order, can_cancel, describe, ship};
use serde::{Deserialize, Serialize};

/// An order as cases.json writes it, the JavaScript object rust-js makes.
#[derive(Serialize, Deserialize, Clone, PartialEq, Debug)]
#[serde(tag = "state", rename_all = "lowercase")]
pub enum Json {
    Pending,
    Paid {
        #[serde(rename = "amountCents")]
        amount_cents: u32,
    },
    Shipped { tracking: String },
    Cancelled { reason: String },
}

impl Json {
    pub fn order(&self) -> Order {
        match self.clone() {
            Json::Pending => Order::Pending,
            Json::Paid { amount_cents } => Order::Paid { amount_cents },
            Json::Shipped { tracking } => Order::Shipped { tracking },
            Json::Cancelled { reason } => Order::Cancelled { reason },
        }
    }

    pub fn of(order: &Order) -> Json {
        match order.clone() {
            Order::Pending => Json::Pending,
            Order::Paid { amount_cents } => Json::Paid { amount_cents },
            Order::Shipped { tracking } => Json::Shipped { tracking },
            Order::Cancelled { reason } => Json::Cancelled { reason },
        }
    }
}

#[derive(Deserialize)]
struct Case {
    order: Json,
    describe: String,
    can_cancel: bool,
    shipped: Json,
}

#[test]
fn native_rust_says_what_each_case_says() {
    let cases: Vec<Case> = serde_json::from_str(include_str!("../../cases.json")).unwrap();
    for case in cases {
        let order = case.order.order();
        assert_eq!(describe(&order), case.describe);
        assert_eq!(can_cancel(&order), case.can_cancel);
        assert_eq!(Json::of(&ship(&order, "TRK1")), case.shipped);
    }
}
