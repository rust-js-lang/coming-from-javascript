//! Chapter 25: calling an npm package. `till`, this chapter's `till/`, is
//! installed as any npm package is and imported by its name. Each of its
//! functions asks for one shape of argument: each binding here says that
//! shape in Rust, written from the package's `index.d.ts`, and each `pub`
//! function builds it and calls.
//!
//! Natively there's no JavaScript to call, so each binding's body is
//! `unreachable!()`: these run only as JavaScript.

use std::marker::PhantomData;

use js::{Dict, IntoUnknown, JsObject, Rest, dict};

// ── 1. Numbers, a string, a boolean ─────────────────────────────────────

/// `money(cents: number, currency: string, symbol: boolean): string`
#[cfg_attr(rust_js, rust_js::link_name = "till#money")]
fn money(cents: u32, currency: &str, symbol: bool) -> String {
    unreachable!("{cents} {currency} {symbol}: a binding runs only in JavaScript")
}

pub fn monies(cents: u32) -> Vec<String> {
    vec![money(cents, "EUR", true), money(cents, "EUR", false)]
}

// ── 2. A parameter you may leave out ────────────────────────────────────

/// `pad(text: string, width?: number): string`
#[cfg_attr(rust_js, rust_js::link_name = "till#pad")]
fn pad(text: &str, width: Option<u32>) -> String {
    unreachable!("{text} {width:?}: a binding runs only in JavaScript")
}

pub fn padded(text: &str) -> Vec<String> {
    vec![pad(text, None), pad(text, Some(6))]
}

// ── 3. An options object ────────────────────────────────────────────────

/// `PriceOptions`: each field may be left out, so each is an `Option`,
/// and `Default` makes every one `None`.
#[derive(Default)]
pub struct PriceOptions<'a> {
    pub currency: Option<&'a str>,
    pub symbol: Option<bool>,
    pub decimals: Option<u32>,
}

/// `price(cents: number, options?: PriceOptions): string`
#[cfg_attr(rust_js, rust_js::link_name = "till#price")]
fn price(cents: u32, options: Option<PriceOptions<'_>>) -> String {
    let _ = options;
    unreachable!("{cents}: a binding runs only in JavaScript")
}

pub fn prices(cents: u32) -> Vec<String> {
    vec![
        price(cents, None),
        price(
            cents,
            Some(PriceOptions {
                currency: Some("EUR"),
                ..Default::default()
            }),
        ),
        price(
            cents,
            Some(PriceOptions {
                currency: Some("GBP"),
                symbol: Some(false),
                decimals: Some(0),
            }),
        ),
    ]
}

// ── 4. One of a few strings ─────────────────────────────────────────────

/// `type Rounding = 'up' | 'down' | 'nearest'`: an enum whose variants
/// are those strings.
#[derive(Clone, Copy)]
pub enum Rounding {
    #[cfg_attr(rust_js, rust_js::name = "up")]
    Up,
    #[cfg_attr(rust_js, rust_js::name = "down")]
    Down,
    #[cfg_attr(rust_js, rust_js::name = "nearest")]
    Nearest,
}

/// `round(cents: number, step: number, mode: Rounding): number`
#[cfg_attr(rust_js, rust_js::link_name = "till#round")]
fn round(cents: u32, step: u32, mode: Rounding) -> u32 {
    let _ = mode;
    unreachable!("{cents} {step}: a binding runs only in JavaScript")
}

pub fn rounded(cents: u32) -> Vec<u32> {
    [Rounding::Up, Rounding::Down, Rounding::Nearest]
        .iter()
        .map(|&mode| round(cents, 25, mode))
        .collect()
}

// ── 5. A number or a string ─────────────────────────────────────────────

/// What `number | string` takes: a trait each member implements.
#[cfg_attr(rust_js, rust_js::types = "number | string")]
pub trait IntoOff {}
impl IntoOff for u32 {}
impl IntoOff for &str {}

/// `discount(cents: number, off: number | string): number`
#[cfg_attr(rust_js, rust_js::link_name = "till#discount")]
fn discount(cents: u32, off: impl IntoOff) -> u32 {
    let _ = off;
    unreachable!("{cents}: a binding runs only in JavaScript")
}

pub fn discounts(cents: u32) -> Vec<u32> {
    vec![discount(cents, 150_u32), discount(cents, "10%")]
}

// ── 6. A pair ───────────────────────────────────────────────────────────

/// `clamp(cents: number, range: [number, number]): number`: a tuple.
#[cfg_attr(rust_js, rust_js::link_name = "till#clamp")]
fn clamp(cents: u32, range: (u32, u32)) -> u32 {
    unreachable!("{cents} {range:?}: a binding runs only in JavaScript")
}

pub fn clamped(cents: u32) -> u32 {
    clamp(cents, (100, 5000))
}

// ── 7. A function the package calls ─────────────────────────────────────

/// `Item`: `qty?: number` is an `Option`, left out when it's `None`.
pub struct Item {
    pub name: String,
    pub cents: u32,
    pub qty: Option<u32>,
}

/// `sumBy<T>(items: T[], by: (item: T) => number): number`, of `Item`s.
#[cfg_attr(rust_js, rust_js::link_name = "till#sumBy")]
fn sum_by(items: &[Item], by: impl Fn(&Item) -> u32) -> u32 {
    let _ = (items, by);
    unreachable!("a binding runs only in JavaScript")
}

pub fn count(items: &[Item]) -> u32 {
    sum_by(items, |item| item.qty.unwrap_or(1))
}

// ── 8. Any number of arguments ──────────────────────────────────────────

/// `line(...parts: string[]): string`: `variadic` makes the last
/// parameter the rest arguments.
#[cfg_attr(rust_js, rust_js::link_name = "till#line")]
#[cfg_attr(rust_js, rust_js::variadic)]
fn line(parts: impl Rest<str>) -> String {
    let _ = parts;
    unreachable!("a binding runs only in JavaScript")
}

pub fn lines(shop: &str, parts: &[&str]) -> Vec<String> {
    vec![line((shop, "thank you")), line(parts)]
}

// ── 9. A string, or null ────────────────────────────────────────────────

/// `label(name: string, note: string | null): string`: `nullable(note)`
/// passes `note`'s `None` as `null`.
#[cfg_attr(rust_js, rust_js::link_name = "till#label")]
#[cfg_attr(rust_js, rust_js::nullable(note))]
fn label(name: &str, note: Option<&str>) -> String {
    unreachable!("{name} {note:?}: a binding runs only in JavaScript")
}

pub fn labels(name: &str) -> Vec<String> {
    vec![label(name, Some("decaf")), label(name, None)]
}

// ── 10. An object used as a map ─────────────────────────────────────────

/// `tax(cents: number, rates: Record<string, number>): number`: a
/// `Dict`, an object of any keys.
#[cfg_attr(rust_js, rust_js::link_name = "till#tax")]
fn tax(cents: u32, rates: &Dict<f64>) -> u32 {
    let _ = rates;
    unreachable!("{cents}: a binding runs only in JavaScript")
}

pub fn taxes(cents: u32) -> u32 {
    tax(cents, dict::from_entries(vec![("vat", 0.2), ("city", 0.015)]))
}

// ── 11. One of two objects ──────────────────────────────────────────────

/// `type Coupon = { kind: 'percent'; percent: number } | { kind: 'fixed';
/// cents: number }`: an enum whose tag is `kind`.
#[cfg_attr(rust_js, rust_js::tag = "kind")]
pub enum Coupon {
    #[cfg_attr(rust_js, rust_js::name = "percent")]
    Percent { percent: u32 },
    #[cfg_attr(rust_js, rust_js::name = "fixed")]
    Fixed { cents: u32 },
}

/// `applyCoupon(cents: number, coupon: Coupon): number`
#[cfg_attr(rust_js, rust_js::link_name = "till#applyCoupon")]
fn apply_coupon(cents: u32, coupon: &Coupon) -> u32 {
    let _ = coupon;
    unreachable!("{cents}: a binding runs only in JavaScript")
}

pub fn coupons(cents: u32) -> Vec<u32> {
    vec![
        apply_coupon(cents, &Coupon::Percent { percent: 10 }),
        apply_coupon(cents, &Coupon::Fixed { cents: 300 }),
    ]
}

// ── 12. Objects in objects ──────────────────────────────────────────────

/// `{ name: string; email?: string }`
pub struct Customer {
    pub name: String,
    pub email: Option<String>,
}

/// `Order`: a struct of structs, a `Vec` of them, and an `Option`.
pub struct Order {
    pub customer: Customer,
    pub items: Vec<Item>,
    pub coupon: Option<Coupon>,
}

/// `total(order: Order): number`
#[cfg_attr(rust_js, rust_js::link_name = "till#total")]
fn total(order: &Order) -> u32 {
    let _ = order;
    unreachable!("a binding runs only in JavaScript")
}

pub fn order_total(name: &str, coupon: Option<Coupon>) -> u32 {
    total(&Order {
        customer: Customer {
            name: name.to_string(),
            email: None,
        },
        items: vec![
            Item {
                name: "tea".to_string(),
                cents: 350,
                qty: Some(2),
            },
            Item {
                name: "cake".to_string(),
                cents: 425,
                qty: None,
            },
        ],
        coupon,
    })
}

// ── 13. Any value at all ────────────────────────────────────────────────

/// `describe(value: unknown): string`: any value, `undefined` too, so
/// an `Option` of any value, `None` its `undefined`.
#[cfg_attr(rust_js, rust_js::link_name = "till#describe")]
fn describe(value: Option<&dyn IntoUnknown>) -> String {
    let _ = value;
    unreachable!("a binding runs only in JavaScript")
}

/// What JavaScript sees of Rust's values: `describe` is `JSON.stringify`.
pub fn described() -> Vec<String> {
    let item = Item {
        name: "tea".to_string(),
        cents: 350,
        qty: None,
    };
    vec![
        describe(Some(&item)),
        describe(Some(&Coupon::Fixed { cents: 300 })),
        describe(Some(&(1, "one"))),
        describe(Some(&vec![Rounding::Up, Rounding::Down])),
    ]
}

// ── 14. A class ─────────────────────────────────────────────────────────

/// A `Register`, made by JavaScript: Rust holds a reference to it.
pub struct Register(PhantomData<JsObject>);

/// `{ currency?: string }`
#[derive(Default)]
pub struct RegisterOptions<'a> {
    pub currency: Option<&'a str>,
}

/// `new Register(options?)`
#[cfg_attr(rust_js, rust_js::link_name = "new till#Register")]
fn new_register(options: Option<RegisterOptions<'_>>) -> &'static Register {
    let _ = options;
    unreachable!("a binding runs only in JavaScript")
}

impl Register {
    /// `add(item: Item): void`
    #[cfg_attr(rust_js, rust_js::link_name = "add")]
    fn add(&self, item: &Item) {
        let _ = item;
        unreachable!("a binding runs only in JavaScript")
    }

    /// `get total(): number`
    #[cfg_attr(rust_js, rust_js::link_name = "get total")]
    fn total(&self) -> u32 {
        unreachable!("a binding runs only in JavaScript")
    }

    /// `receipt(): string[]`
    #[cfg_attr(rust_js, rust_js::link_name = "receipt")]
    fn receipt(&self) -> Vec<String> {
        unreachable!("a binding runs only in JavaScript")
    }
}

pub fn ring_up(items: &[Item]) -> (Vec<String>, u32) {
    let register = new_register(Some(RegisterOptions {
        currency: Some("GBP"),
    }));
    for item in items {
        register.add(item);
    }
    (register.receipt(), register.total())
}
