// The JavaScript's unit tests, beside lib.rs's `mod tests`: a file of its
// own, which reaches only what password.js exports.
import { expect, test } from 'bun:test'
import { average, strength } from './password.js'

test('a long mixed password is strong', () => {
  expect(strength('Correct-Horse-9')).toBe('strong')
})

test('short is weak however mixed', () => {
  expect(strength('aB3$')).toBe('weak')
})

test('averaging nothing is NaN, not an error', () => {
  expect(average([])).toBeNaN()
})
