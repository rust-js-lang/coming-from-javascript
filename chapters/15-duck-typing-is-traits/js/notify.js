// Chapter 15: duck typing in JavaScript. Anything with `channel()` and
// `send()` is a notifier, found out when the methods are called. Beside
// `rust/src/lib.rs`'s trait.

export const email = (address) => ({
  channel: () => 'email',
  send: (message) => `emailed ${address}: ${message}`,
})

export const sms = (number) => ({
  channel: () => 'sms',
  send: (message) => `texted ${number}: ${message.slice(0, 20)}`,
})

// A notifier with its method misspelled. Nothing notices until it's sent to.
export const pager = (code) => ({
  channel: () => 'pager',
  sned: (message) => `paged ${code}: ${message}`,
})

// Sends the message by every notifier, and says what each did. The
// notifiers before a broken one have already sent when it throws.
export function broadcast(notifiers, message, log = []) {
  for (const notifier of notifiers) log.push(notifier.send(message))
  return log
}
