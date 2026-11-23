// The JavaScript and the Rust rust-js compiled give what cases.json records
// native Rust giving. rust/tests/native.rs holds native Rust to the cases.
import { expect, test } from 'bun:test'
import cases from './cases.json'
import * as js from './js/notify.js'
import * as rust from './rust/src/lib.js'

for (const c of cases) {
  test(`${c.emails.length} emails and ${c.phones.length} texts`, () => {
    const emails = c.emails.map((address) => ({ address }))
    const phones = c.phones.map((number) => ({ number }))
    expect(rust.broadcast(emails, phones, c.message)).toEqual(c.sent)
    expect(rust.previews(emails, phones, c.message)).toEqual(c.previews)
    const notifiers = [...c.emails.map(js.email), ...c.phones.map(js.sms)]
    expect(js.broadcast(notifiers, c.message)).toEqual(c.sent)
  })
}

test('a misspelled method throws when it is reached, after the others have sent', () => {
  const log = []
  const notifiers = [js.email('ada@example.com'), js.pager('42'), js.sms('555-0100')]
  expect(() => js.broadcast(notifiers, 'deploying', log)).toThrow(TypeError)
  expect(log).toEqual(['emailed ada@example.com: deploying'])
})

test("an impl is an object of the type's methods, given its value", () => {
  const ada = { address: 'ada@example.com' }
  expect(rust.emailNotifier.send(ada, 'hi')).toBe('emailed ada@example.com: hi')
  expect(rust.notify(ada, 'hi', rust.emailNotifier)).toBe('emailed ada@example.com: hi')
})
