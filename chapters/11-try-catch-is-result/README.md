# 11. `try`/`catch` is `Result`

## Errors you can't see coming

```js
// js/signup.js
export function signUp(form) {
  const email = form.email.trim()
  if (email === '') throw new Error('an email is needed')
  if (!email.includes('@')) throw new Error(`${JSON.stringify(email)} isn't an email`)
  if (form.password.length < 8) throw new Error('the password needs at least 8 characters')
  return { email, age: parseAge(form.age) }
}
```

`signUp`'s first line says nothing about failing. You find the five ways
it throws by reading its body and the bodies of what it calls. The caller
must remember a `try`, and its `catch` gets whatever was thrown:

```js
export function message(form) {
  try {
    return `welcome, ${signUp(form).email}`
  } catch (error) {
    return `sorry: ${error.message}`
  }
}
```

That `catch` catches *everything*, bugs included. Give it a form with no
password field, and the `TypeError` from `form.password.length` is shown
to the user as if it were a problem with their form:

```
sorry: undefined is not an object (evaluating 'form.password.length')
```

## A `Result` says it can fail, and how

Rust has no exceptions for failures you expect. A function that can fail
returns a `Result`, an enum of two variants:

```rust
enum Result<T, E> {
    Ok(T),    // it worked: here's the value
    Err(E),   // it didn't: here's why
}
```

```rust
// rust/src/lib.rs
pub fn sign_up(form: &Form) -> Result<Account, SignUpError>
```

Now the first line says it all: an `Account`, or a `SignUpError`. The
error is an enum (chapter 9) that lists every way to fail:

```rust
pub enum SignUpError {
    NoEmail,
    BadEmail { email: String },
    ShortPassword { min: usize },
    BadAge { why: String },
}
```

A caller can't reach the `Account` without opening the `Result`, so it
can't forget the failure. A `match` must handle both:

```rust
pub fn message(form: &Form) -> String {
    match sign_up(form) {
        Ok(account) => format!("welcome, {}", account.email),
        Err(problem) => format!("sorry: {problem}"),
    }
}
```

And because the error is a value, code can tell the problems apart
without reading a message: `ShortPassword { min }` carries the 8.

## `?` passes a failure on

```rust
pub fn sign_up(form: &Form) -> Result<Account, SignUpError> {
    // ...
    let age = parse_age(&form.age).map_err(|why| SignUpError::BadAge { why })?;
    Ok(Account { email: email.to_string(), age })
}
```

`?` after a `Result` means: if it's an `Err`, return it from this function
now; if it's `Ok`, here's the value. It's `throw`'s early exit, but you
can see each place it can happen. `map_err` turns `parse_age`'s error, a
`String`, into this function's kind. Leave out the `?`, and `age` is a
`Result`, not a number:

```
error[E0308]: mismatched types
   expected `u8`, found `Result<u8, String>`
```

## Panics are for bugs

Rust does have something like `throw`: a *panic*, which stops the
program, as dividing by zero did in chapter 4. It's for bugs, things that
should never happen. A user typing a bad email isn't a bug; it's a
`Result`. Panics aren't caught as everyday errors, so a bug can't be
dressed up as a form problem.

## What rust-js writes

A `Result` is an object with a `TAG`, and `?` is the check you'd write:

```js
// rust/src/lib.js (generated)
export function signUp(form) {
  const email = $trim(form.email);
  if (email === "") {
    return { TAG: "Err", _0: { problem: "no-email" } };
  }
  // ...
  const result = parseAge(form.age);
  const result$1 =
    result.TAG === "Err" ? { TAG: "Err", _0: { problem: "bad-age", why: result._0 } } : result;
  if (result$1.TAG === "Err") {
    return result$1;
  }
  const age = result$1._0;
  return { TAG: "Ok", _0: { email, age } };
}
```

Your JavaScript checks `result.TAG === 'Ok'`, then reads `result._0`, and
a problem is a plain object to `switch` on: `{ problem:
"short-password", min: 8 }`.

## Side by side

Every form gets the same answer, but two ages:

```
"ada@example.com", age "300"
  js:   sorry: 300 is out of range
  rust: sorry: "300" isn't an age
"ada@example.com", age "0x1A"
  js:   welcome, ada@example.com
  rust: sorry: "0x1A" isn't an age
```

JavaScript's `Number("0x1A")` reads hexadecimal, so 26 years old. Rust's
`parse` into a `u8` takes only decimal digits, and 300 doesn't fit a
`u8` at all.

## Try it

In `sign_up`, replace the `parse_age` line with `let age = parse_age(&form.age);` and run
`cargo build`: E0308, a `Result<u8, String>` where a `u8` belongs. The
failure can't slip past unhandled.
