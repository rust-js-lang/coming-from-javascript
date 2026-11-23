// Chapter 11: a sign-up form checked in JavaScript, where a problem is
// thrown, beside `rust/src/lib.rs`'s `Result`.

// An age typed into the form, or a thrown error.
export function parseAge(text) {
  const age = Number(text.trim())
  if (text.trim() === '' || !Number.isInteger(age)) throw new Error(`${JSON.stringify(text)} isn't an age`)
  if (age < 13 || age > 120) throw new Error(`${age} is out of range`)
  return age
}

// The form checked: an account, or a thrown error. Nothing in its first
// line says it can throw, or what.
export function signUp(form) {
  const email = form.email.trim()
  if (email === '') throw new Error('an email is needed')
  if (!email.includes('@')) throw new Error(`${JSON.stringify(email)} isn't an email`)
  if (form.password.length < 8) throw new Error('the password needs at least 8 characters')
  return { email, age: parseAge(form.age) }
}

// What the page shows: the account's email, or the problem. The `catch`
// catches anything thrown, a typo's TypeError too.
export function message(form) {
  try {
    return `welcome, ${signUp(form).email}`
  } catch (error) {
    return `sorry: ${error.message}`
  }
}
