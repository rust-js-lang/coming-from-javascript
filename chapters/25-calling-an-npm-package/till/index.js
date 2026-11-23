// till: a small cash-register package. Each export asks for one shape of
// argument, the shapes npm packages ask for, so chapter 25 can show how
// Rust builds each.

const SYMBOLS = { USD: '$', EUR: '€', GBP: '£' }

/** Numbers, a string and a boolean. */
export function money(cents, currency, symbol) {
  const amount = (cents / 100).toFixed(2)
  return symbol ? `${SYMBOLS[currency] ?? ''}${amount}` : `${amount} ${currency}`
}

/** A parameter you may leave out: `width` is 12 when it's missing. */
export function pad(text, width) {
  return text.padStart(width ?? 12)
}

/** An options object: every field may be left out. */
export function price(cents, options) {
  const { currency = 'USD', symbol = true, decimals = 2 } = options ?? {}
  const amount = (cents / 100).toFixed(decimals)
  return symbol ? `${SYMBOLS[currency] ?? ''}${amount}` : `${amount} ${currency}`
}

/** One of three strings. */
export function round(cents, step, mode) {
  const round = { up: Math.ceil, down: Math.floor, nearest: Math.round }[mode]
  if (round === undefined) throw new TypeError(`round: unknown mode ${mode}`)
  return round(cents / step) * step
}

/** A number or a string: 150 is 150 cents off, '10%' is ten percent off. */
export function discount(cents, off) {
  if (typeof off === 'number') return Math.max(0, cents - off)
  const percent = Number.parseFloat(off)
  return Math.round(cents * (1 - percent / 100))
}

/** A pair, `[min, max]`. */
export function clamp(cents, [min, max]) {
  return Math.min(max, Math.max(min, cents))
}

/** A function the package calls, once per item. */
export function sumBy(items, by) {
  let sum = 0
  for (const item of items) sum += by(item)
  return sum
}

/** Any number of strings. */
export function line(...parts) {
  return parts.join(' · ')
}

/** A string, or `null` for none. */
export function label(name, note) {
  if (note === undefined) throw new TypeError('label: note is required, null for none')
  return note === null ? name : `${name} (${note})`
}

/** An object used as a map: each key a tax's name, each value its rate. */
export function tax(cents, rates) {
  let sum = 0
  for (const rate of Object.values(rates)) sum += Math.round(cents * rate)
  return sum
}

/** One of two objects, told apart by `kind`. */
export function applyCoupon(cents, coupon) {
  switch (coupon.kind) {
    case 'percent':
      return Math.round(cents * (1 - coupon.percent / 100))
    case 'fixed':
      return Math.max(0, cents - coupon.cents)
    default:
      throw new TypeError(`applyCoupon: unknown kind ${coupon.kind}`)
  }
}

/** Objects in objects, an array of them, and fields that may be missing. */
export function total(order) {
  const items = order.items.reduce((sum, item) => sum + item.cents * (item.qty ?? 1), 0)
  return order.coupon == null ? items : applyCoupon(items, order.coupon)
}

/** Any value at all. */
export function describe(value) {
  return JSON.stringify(value)
}

/** A class: made with `new`, then its methods and a getter. */
export class Register {
  #currency
  #items = []

  constructor(options) {
    this.#currency = options?.currency ?? 'USD'
  }

  add(item) {
    this.#items.push(item)
  }

  get total() {
    return total({ items: this.#items })
  }

  receipt() {
    return this.#items.map((item) => `${item.name} ${money(item.cents * (item.qty ?? 1), this.#currency, true)}`)
  }
}
