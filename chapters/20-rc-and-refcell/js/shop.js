// Chapter 20: sharing on purpose. A page's header and its checkout both
// hold the one cart: in JavaScript, every object is shared like this.

// The header shows how many items the cart has; the checkout adds to it.
export function makePage() {
  const cart = { items: [] }
  const header = { cart, badge: () => `${cart.items.length} items` }
  const checkout = { cart, add: (item) => cart.items.push(item) }
  return { header, checkout }
}

// Each item added at the checkout, and the header's badge after each.
export function shop(items) {
  const { header, checkout } = makePage()
  return items.map((item) => {
    checkout.add(item)
    return header.badge()
  })
}

// Reads the cart while adding to it: allowed, and the reader sees the add.
export function readWhileAdding() {
  const items = ['tea']
  const reading = items
  items.push('cake')
  return reading.length
}
