// What a package's types say is what you bind: each Rust binding in
// chapter 25 is written from one of these lines.

export function money(cents: number, currency: string, symbol: boolean): string

export function pad(text: string, width?: number): string

export interface PriceOptions {
  currency?: string
  symbol?: boolean
  decimals?: number
}
export function price(cents: number, options?: PriceOptions): string

export type Rounding = 'up' | 'down' | 'nearest'
export function round(cents: number, step: number, mode: Rounding): number

export function discount(cents: number, off: number | string): number

export function clamp(cents: number, range: [number, number]): number

export function sumBy<T>(items: T[], by: (item: T) => number): number

export function line(...parts: string[]): string

export function label(name: string, note: string | null): string

export function tax(cents: number, rates: Record<string, number>): number

export type Coupon = { kind: 'percent'; percent: number } | { kind: 'fixed'; cents: number }
export function applyCoupon(cents: number, coupon: Coupon): number

export interface Item {
  name: string
  cents: number
  qty?: number
}
export interface Order {
  customer: { name: string; email?: string }
  items: Item[]
  coupon?: Coupon | null
}
export function total(order: Order): number

export function describe(value: unknown): string

export class Register {
  constructor(options?: { currency?: string })
  add(item: Item): void
  get total(): number
  receipt(): string[]
}
