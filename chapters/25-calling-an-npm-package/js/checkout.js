// The same calls, written in JavaScript: what rust/src/lib.rs does through
// its bindings, each argument built by hand.
import {
  Register,
  applyCoupon,
  clamp,
  describe,
  discount,
  label,
  line,
  money,
  pad,
  price,
  round,
  sumBy,
  tax,
  total,
} from 'till'

export const monies = (cents) => [money(cents, 'EUR', true), money(cents, 'EUR', false)]

export const padded = (text) => [pad(text), pad(text, 6)]

export const prices = (cents) => [
  price(cents),
  price(cents, { currency: 'EUR' }),
  price(cents, { currency: 'GBP', symbol: false, decimals: 0 }),
]

export const rounded = (cents) => ['up', 'down', 'nearest'].map((mode) => round(cents, 25, mode))

export const discounts = (cents) => [discount(cents, 150), discount(cents, '10%')]

export const clamped = (cents) => clamp(cents, [100, 5000])

export const count = (items) => sumBy(items, (item) => item.qty ?? 1)

export const lines = (shop, parts) => [line(shop, 'thank you'), line(...parts)]

export const labels = (name) => [label(name, 'decaf'), label(name, null)]

export const taxes = (cents) => tax(cents, { vat: 0.2, city: 0.015 })

export const coupons = (cents) => [
  applyCoupon(cents, { kind: 'percent', percent: 10 }),
  applyCoupon(cents, { kind: 'fixed', cents: 300 }),
]

export const orderTotal = (name, coupon) =>
  total({
    customer: { name },
    items: [
      { name: 'tea', cents: 350, qty: 2 },
      { name: 'cake', cents: 425 },
    ],
    coupon,
  })

export const described = () => [
  describe({ name: 'tea', cents: 350 }),
  describe({ kind: 'fixed', cents: 300 }),
  describe([1, 'one']),
  describe(['up', 'down']),
]

export function ringUp(items) {
  const register = new Register({ currency: 'GBP' })
  for (const item of items) register.add(item)
  return [register.receipt(), register.total]
}
