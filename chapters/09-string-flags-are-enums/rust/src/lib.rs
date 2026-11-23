//! Chapter 9: string flags are enums. An enum lists every state a value
//! can be in, each with the data that state has, and a `match` must handle
//! every one.

/// An order's state. `#[rust_js::tag]` and `#[rust_js::name]` make each the
/// JavaScript object you'd write by hand, `{ state: "paid", amountCents }`.
#[derive(Debug, Clone, PartialEq)]
#[cfg_attr(rust_js, rust_js::tag = "state")]
pub enum Order {
    #[cfg_attr(rust_js, rust_js::name = "pending")]
    Pending,
    #[cfg_attr(rust_js, rust_js::name = "paid")]
    Paid { amount_cents: u32 },
    #[cfg_attr(rust_js, rust_js::name = "shipped")]
    Shipped { tracking: String },
    #[cfg_attr(rust_js, rust_js::name = "cancelled")]
    Cancelled { reason: String },
}

/// The state in words. Each arm takes its state's own data out; a
/// misspelled state isn't a state, and doesn't compile.
pub fn describe(order: &Order) -> String {
    match order {
        Order::Pending => "waiting for payment".to_string(),
        Order::Paid { amount_cents } => format!("paid {amount_cents} cents"),
        Order::Shipped { tracking } => format!("on its way: {tracking}"),
        Order::Cancelled { reason } => format!("cancelled: {reason}"),
    }
}

/// Whether it can still be cancelled: `matches!` is a `match` that
/// answers yes or no.
pub fn can_cancel(order: &Order) -> bool {
    matches!(order, Order::Pending | Order::Paid { .. })
}

/// Ships a paid order; any other is left as it was. Only `Shipped` has a
/// `tracking`, so no other state can be read for one.
pub fn ship(order: &Order, tracking: &str) -> Order {
    match order {
        Order::Paid { .. } => Order::Shipped { tracking: tracking.to_string() },
        other => other.clone(),
    }
}
