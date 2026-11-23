// Chapter 9: an order's state as a string flag, with the data each state
// needs as optional properties, beside `rust/src/lib.rs`'s enum.
//
//   { state: 'pending' }
//   { state: 'paid', amountCents }
//   { state: 'shipped', tracking }
//   { state: 'cancelled', reason }

// The state in words. A misspelled case, 'shiped', never matches, and a
// shipped order falls to the default.
export function describe(order) {
  switch (order.state) {
    case 'pending':
      return 'waiting for payment'
    case 'paid':
      return `paid ${order.amountCents} cents`
    case 'shiped':
      return `on its way: ${order.tracking}`
    case 'cancelled':
      return `cancelled: ${order.reason}`
    default:
      return 'unknown'
  }
}

// Whether it can still be cancelled.
export const canCancel = (order) => order.state === 'pending' || order.state === 'paid'

// Ships a paid order; any other is left as it was. Nothing stops reading
// `order.tracking` of an order that hasn't shipped: it's undefined.
export function ship(order, tracking) {
  return order.state === 'paid' ? { state: 'shipped', tracking } : order
}
