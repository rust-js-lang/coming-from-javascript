# 25. Calling an npm package: building its arguments

Chapter 24 called one JavaScript function that took one number. Real
packages ask for more: an options object, a callback, `'up' | 'down'`, a
number *or* a string, `null` for "none", any number of arguments, an
instance made with `new`. This chapter takes each shape in turn.

The recipe never changes. There are three steps:

```
  the package's .d.ts           your Rust                       the JS rust-js writes
  ───────────────────           ─────────                       ─────────────────────
  price(cents: number,    ──►   fn price(cents: u32,      ──►   price(cents, { currency: "EUR" })
        options?: {...})              options: Option<PriceOptions>)
                                price(c, Some(PriceOptions {
                                    currency: Some("EUR"),
                                    ..Default::default() }))
       1. read the line         2. say it in Rust,               3. rust-js writes the
                                   then build the value             call a person would
```

You read the package's type line, write the same shape in Rust types,
and build the value with ordinary Rust. rust-js then writes the
JavaScript call you'd have written by hand.

## The package

`till/` is a small npm package: `package.json`, `index.js` and
`index.d.ts`, like any you'd install. Each of its functions asks for one
shape. The guide installs it as npm installs any package:

```json
// package.json
"dependencies": {
  "till": "file:chapters/25-calling-an-npm-package/till"
}
```

So Rust imports it by its name, `till#money`, the same as `lodash-es#chunk`
or `canvas-confetti#default`. `js/checkout.js` makes every call by hand in
JavaScript, and `compare.test.js` checks that Rust's calls give the same
answers.

## The whole map

| The package says | Rust type in the binding | You build it as | rust-js writes |
|---|---|---|---|
| `number`, `string`, `boolean` | `u32` or `f64`, `&str`, `bool` | `money(1999, "EUR", true)` | `money(1999, "EUR", true)` |
| `width?: number` | `Option<u32>` | `None`, `Some(6)` | `pad(text)`, `pad(text, 6)` |
| `options?: { a?: .. }` | `Option<Struct>` of `Option` fields | `Struct { a: Some(..), ..Default::default() }` | `{ a: .. }` |
| `'up' \| 'down'` | an enum, each variant `rust_js::name`d | `Rounding::Up` | `"up"` |
| `number \| string` | `impl Trait`, a trait each member implements | `150_u32` or `"10%"` | `150`, `"10%"` |
| `[number, number]` | a tuple, `(u32, u32)` | `(100, 5000)` | `[100, 5000]` |
| `(item: T) => number` | `impl Fn(&T) -> u32` | a closure | an arrow function |
| `...parts: string[]` | `impl Rest<str>`, with `variadic` | `(a, b)` or `&parts` | `line(a, b)`, `line(...parts)` |
| `string \| null` | `Option<&str>`, with `nullable(note)` | `None` | `null` |
| `Record<string, number>` | `&Dict<f64>` | `dict::from_entries(vec![..])` | `{ vat: 0.2, .. }` |
| `{ kind: 'a', .. } \| { kind: 'b', .. }` | an enum, `rust_js::tag = "kind"` | `Coupon::Fixed { cents: 300 }` | `{ kind: "fixed", cents: 300 }` |
| objects in objects | structs in structs, `Vec`s of them | a struct literal | an object literal |
| `unknown` | `Option<&dyn IntoUnknown>` | `Some(&anything)` | the value |
| `class X` | a struct, `new` and methods bound | `new_register(..)`, `register.add(..)` | `new Register(..)`, `register.add(..)` |

Each row has its own section below.

## 1. Numbers, a string, a boolean

```ts
export function money(cents: number, currency: string, symbol: boolean): string
```

```rust
#[cfg_attr(rust_js, rust_js::link_name = "till#money")]
fn money(cents: u32, currency: &str, symbol: bool) -> String {
    unreachable!("{cents} {currency} {symbol}: a binding runs only in JavaScript")
}

money(cents, "EUR", true)
```

JavaScript has one `number`, but Rust has many. Choose the one that tells
the truth: cents are whole and never negative, so they're `u32`. A
measurement would be `f64`. In JavaScript both are just `number`, so the
call is the same.

## 2. A parameter you may leave out

```ts
export function pad(text: string, width?: number): string
```

```rust
fn pad(text: &str, width: Option<u32>) -> String

vec![pad(text, None), pad(text, Some(6))]
```

```js
return [pad(text), pad(text, 6)];
```

`width?` is an `Option`. A `None` at the end isn't `pad(text, undefined)`,
it's no argument at all, as you'd write it.

## 3. An options object

```ts
export interface PriceOptions { currency?: string; symbol?: boolean; decimals?: number }
export function price(cents: number, options?: PriceOptions): string
```

This is the most common shape on npm. In Rust it's a struct whose fields
are all `Option`s, and `#[derive(Default)]` makes every field `None`:

```rust
#[derive(Default)]
pub struct PriceOptions<'a> {
    pub currency: Option<&'a str>,
    pub symbol: Option<bool>,
    pub decimals: Option<u32>,
}

fn price(cents: u32, options: Option<PriceOptions<'_>>) -> String

price(cents, None),
price(cents, Some(PriceOptions { currency: Some("EUR"), ..Default::default() })),
price(cents, Some(PriceOptions { currency: Some("GBP"), symbol: Some(false), decimals: Some(0) })),
```

`..Default::default()` reads "every field I didn't name is `None`", and
a `None` field is left out of the object:

```js
price(cents),
price(cents, { currency: "EUR" }),
price(cents, { currency: "GBP", symbol: false, decimals: 0 }),
```

A Rust field is `snake_case` and JavaScript's is `camelCase`, so
`decimal_places` would be written `decimalPlaces`.

## 4. One of a few strings

```ts
export type Rounding = 'up' | 'down' | 'nearest'
export function round(cents: number, step: number, mode: Rounding): number
```

This is chapter 9's enum. Each variant's `rust_js::name` is its string:

```rust
#[derive(Clone, Copy)]
pub enum Rounding {
    #[cfg_attr(rust_js, rust_js::name = "up")]
    Up,
    #[cfg_attr(rust_js, rust_js::name = "down")]
    Down,
    #[cfg_attr(rust_js, rust_js::name = "nearest")]
    Nearest,
}

[Rounding::Up, Rounding::Down, Rounding::Nearest].iter().map(|&mode| round(cents, 25, mode))
```

```js
return ["up", "down", "nearest"].map((mode) => round(cents, 25, mode));
```

In JavaScript, `round(1999, 25, 'upp')` throws when it runs. In Rust,
`Rounding::Upp` doesn't compile.

## 5. A number or a string

```ts
export function discount(cents: number, off: number | string): number
```

A union you *give* is a trait, implemented by each member it allows:

```rust
#[cfg_attr(rust_js, rust_js::types = "number | string")]
pub trait IntoOff {}
impl IntoOff for u32 {}
impl IntoOff for &str {}

fn discount(cents: u32, off: impl IntoOff) -> u32

vec![discount(cents, 150_u32), discount(cents, "10%")]
```

```js
return [discount(cents, 150), discount(cents, "10%")];
```

Each value is passed as it is. Anything else is rustc's error:

```
error[E0277]: the trait bound `bool: IntoOff` is not satisfied
    |     discount(cents, true)
    |                     ^^^^ the trait `IntoOff` is not implemented for `bool`
```

(The `_u32` is there because a bare `150` could be any integer type, and
rustc doesn't guess from the trait.)

## 6. A pair

```ts
export function clamp(cents: number, range: [number, number]): number
```

```rust
fn clamp(cents: u32, range: (u32, u32)) -> u32

clamp(cents, (100, 5000))
```

```js
return clamp(cents, [100, 5000]);
```

A tuple is an array.

## 7. A function the package calls

```ts
export function sumBy<T>(items: T[], by: (item: T) => number): number
```

```rust
pub struct Item {
    pub name: String,
    pub cents: u32,
    pub qty: Option<u32>,
}

fn sum_by(items: &[Item], by: impl Fn(&Item) -> u32) -> u32

sum_by(items, |item| item.qty.unwrap_or(1))
```

```js
return sumBy(items, (item) => item.qty ?? 1);
```

A closure is a function. Here the package calls it only before
`sumBy` returns, so `impl Fn` is enough. A callback the package *keeps*
and calls later, like an event listener, is `Box<dyn Fn(..)>`, so it can
own what it uses (chapter 14).

## 8. Any number of arguments

```ts
export function line(...parts: string[]): string
```

`variadic` makes the last parameter the rest arguments:

```rust
#[cfg_attr(rust_js, rust_js::link_name = "till#line")]
#[cfg_attr(rust_js, rust_js::variadic)]
fn line(parts: impl Rest<str>) -> String

vec![line((shop, "thank you")), line(parts)]
```

```js
return [line(shop, "thank you"), line(...parts)];
```

A tuple is a fixed list of arguments, each its own. A slice, `&[&str]`,
is spread.

## 9. A string, or null

```ts
export function label(name: string, note: string | null): string
```

`note` isn't optional: the package wants `null` for "no note". A plain
`None` at the end is no argument, so `nullable(note)` says to pass this
parameter's `None` as `null`:

```rust
#[cfg_attr(rust_js, rust_js::link_name = "till#label")]
#[cfg_attr(rust_js, rust_js::nullable(note))]
fn label(name: &str, note: Option<&str>) -> String

vec![label(name, Some("decaf")), label(name, None)]
```

```js
return [label(name, "decaf"), label(name, null)];
```

Leave `nullable` off and the same Rust becomes `label(name)`, which this
package refuses:

```
TypeError: label: note is required, null for none
```

So read the `.d.ts` carefully: `x?: T` is an `Option`, while `x: T | null`
is an `Option` with `nullable`.

## 10. An object used as a map

```ts
export function tax(cents: number, rates: Record<string, number>): number
```

A `Record` has keys you choose as the program runs, not fields you
declare. That's a `Dict`, from rust-js's `js` crate:

```rust
use js::{Dict, dict};

fn tax(cents: u32, rates: &Dict<f64>) -> u32

tax(cents, dict::from_entries(vec![("vat", 0.2), ("city", 0.015)]))
```

```js
return tax(cents, { vat: 0.2, city: 0.015 });
```

## 11. One of two objects

```ts
export type Coupon = { kind: 'percent'; percent: number } | { kind: 'fixed'; cents: number }
```

TypeScript calls this a discriminated union. It's an enum with fields
(chapter 17), and `tag = "kind"` says which field tells the variants
apart:

```rust
#[cfg_attr(rust_js, rust_js::tag = "kind")]
pub enum Coupon {
    #[cfg_attr(rust_js, rust_js::name = "percent")]
    Percent { percent: u32 },
    #[cfg_attr(rust_js, rust_js::name = "fixed")]
    Fixed { cents: u32 },
}

fn apply_coupon(cents: u32, coupon: &Coupon) -> u32

apply_coupon(cents, &Coupon::Percent { percent: 10 }),
apply_coupon(cents, &Coupon::Fixed { cents: 300 }),
```

```js
applyCoupon(cents, { kind: "percent", percent: 10 }),
applyCoupon(cents, { kind: "fixed", cents: 300 }),
```

In JavaScript, `{ kind: 'fixed', percent: 10 }` is a bug you find when it
runs. In Rust there's no way to write it.

## 12. Objects in objects

```ts
export interface Item { name: string; cents: number; qty?: number }
export interface Order {
  customer: { name: string; email?: string }
  items: Item[]
  coupon?: Coupon | null
}
export function total(order: Order): number
```

This is nothing new, only everything above put together. Structs hold
structs, a `Vec` is an array, and an `Option` field is left out when it's
`None`:

```rust
pub struct Customer { pub name: String, pub email: Option<String> }
pub struct Order { pub customer: Customer, pub items: Vec<Item>, pub coupon: Option<Coupon> }

fn total(order: &Order) -> u32

total(&Order {
    customer: Customer { name: name.to_string(), email: None },
    items: vec![
        Item { name: "tea".to_string(), cents: 350, qty: Some(2) },
        Item { name: "cake".to_string(), cents: 425, qty: None },
    ],
    coupon,
})
```

```js
return total({
  customer: { name },
  items: [
    { name: "tea", cents: 350, qty: 2 },
    { name: "cake", cents: 425 },
  ],
  coupon: coupon ?? undefined,
});
```

rust-js also writes these types into `lib.d.ts`. `Coupon` there is the
package's own line:

```ts
export type Coupon = { kind: "percent"; percent: number } | { kind: "fixed"; cents: number };
```

## 13. Any value at all

```ts
export function describe(value: unknown): string   // JSON.stringify
```

`unknown` takes anything, `undefined` too. In Rust that's an `Option` of
any value:

```rust
use js::IntoUnknown;

fn describe(value: Option<&dyn IntoUnknown>) -> String

describe(Some(&item)),
describe(Some(&Coupon::Fixed { cents: 300 })),
describe(Some(&(1, "one"))),
describe(Some(&vec![Rounding::Up, Rounding::Down])),
```

Since `describe` is `JSON.stringify`, it shows what JavaScript sees of
each Rust value:

```
{"name":"tea","cents":350}        a struct; its None field isn't there
{"kind":"fixed","cents":300}      a tagged enum
[1,"one"]                         a tuple
["up","down"]                     a Vec of enum variants
```

## 14. A class

```ts
export class Register {
  constructor(options?: { currency?: string })
  add(item: Item): void
  get total(): number
  receipt(): string[]
}
```

JavaScript makes the object. Rust only holds a reference to it, so the
type is a struct with nothing inside. `new`, the methods and the getter
are each a binding:

```rust
pub struct Register(PhantomData<JsObject>);

#[cfg_attr(rust_js, rust_js::link_name = "new till#Register")]
fn new_register(options: Option<RegisterOptions<'_>>) -> &'static Register

impl Register {
    #[cfg_attr(rust_js, rust_js::link_name = "add")]
    fn add(&self, item: &Item)

    #[cfg_attr(rust_js, rust_js::link_name = "get total")]
    fn total(&self) -> u32

    #[cfg_attr(rust_js, rust_js::link_name = "receipt")]
    fn receipt(&self) -> Vec<String>
}

let register = new_register(Some(RegisterOptions { currency: Some("GBP") }));
for item in items {
    register.add(item);
}
(register.receipt(), register.total())
```

```js
const register = new Register({ currency: "GBP" });
for (let i = 0; i < items.length; i++) {
  const item = items[i];
  register.add(item);
}
return [register.receipt(), register.total];
```

`"get total"` makes `register.total()` in Rust a property read,
`register.total`, in JavaScript.

## What nothing checks

rustc checks every *call* against your binding. Nothing checks your
binding against the package. A binding is a promise you make, as in
chapter 24, and here are the ways an argument's promise can be wrong:

- **A field name the package doesn't know.** Rename `decimals` to
  `decimal_places` in `PriceOptions`. It compiles, rust-js writes
  `decimalPlaces: 0`, and the package quietly ignores a key it doesn't
  read. The price prints `19.99 GBP` instead of `20 GBP`, with no error.
  Copy field names from the `.d.ts` exactly.
- **`null` versus left out.** Section 9: without `nullable`, a `None` is
  no argument, and a package that wants `null` throws.
- **A type that's too wide or too narrow.** `cents: u32` promises that the
  package returns whole numbers. If it returned `19.5`, Rust would be
  holding a `u32` that isn't one
  ([rust-js#2403](https://github.com/rust-js-lang/rust-js/issues/2403)
  will check values at the boundary).

What rustc *does* check is everything on your side. The call has the
right number of arguments, `true` isn't a `number | string`, `'upp'`
isn't a `Rounding`, and a coupon can't have both a `kind: 'fixed'` and a
`percent`. In JavaScript you'd find each of those when it ran.

## Try it

- `bun chapters/25-calling-an-npm-package/compare.js` prints each Rust
  call's answer beside the same call written in JavaScript.
- In `lib.rs`, delete `#[cfg_attr(rust_js, rust_js::nullable(note))]`, run
  `bun run rust`, and look at `labels` in `rust/src/lib.js`: `label(name)`.
  Then run `compare.js` again and watch the package refuse it.
- Rename `decimals` to `decimal_places` (the field and where it's set),
  run `bun run rust`, and see `prices` change its answer without a word.
- Add a `Rounding::Upp` call, and run `cargo build`.
