// Chapter 16: JavaScript functions take any type already. `largest` works
// on numbers and on words, and quietly gives nonsense for anything `>`
// can't order. Beside `rust/src/lib.rs`'s generics.

// The largest item, if there are any.
export function largest(items) {
  if (items.length === 0) return undefined
  let best = items[0]
  for (const item of items) if (item > best) best = item
  return best
}

// A stack of anything.
export class Stack {
  items = []
  push(item) {
    this.items.push(item)
  }
  pop() {
    return this.items.pop()
  }
  peek() {
    return this.items.at(-1)
  }
}

// Whether every bracket in `text` is closed by its partner, in order.
export function balanced(text) {
  const partners = { ')': '(', ']': '[', '}': '{' }
  const open = new Stack()
  for (const c of text) {
    if ('([{'.includes(c)) open.push(c)
    else if (c in partners && open.pop() !== partners[c]) return false
  }
  return open.peek() === undefined
}
