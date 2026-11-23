# 17. Pattern matching

## Checking a shape by hand

A router turns a URL's path into a page. In JavaScript you split the
path and check its parts by index and length:

```js
// js/router.js
export function route(path) {
  const parts = path.split('/').filter((part) => part !== '')
  if (parts.length === 0) return { page: 'home' }
  if (parts[0] === 'users' && parts.length === 1) return { page: 'users' }
  if (parts[0] === 'users' && parts.length === 2) return { page: 'user', id: Number(parts[1]) }
  // ...
}
```

The *shape* you mean, "`users`, then one more part", is spread over
several conditions, and the step that turns the part into an id is
easy to get wrong:

```
/users/abc           js: User NaN               rust: Not found
/users/-1            js: User -1                rust: Not found
/users/4.5           js: User 4.5               rust: Not found
```

## Patterns describe the shape

A Rust `match` (chapter 6) compares a value against *patterns*, and a
pattern can describe a whole shape at once:

```rust
// rust/src/lib.rs
pub fn route(path: &str) -> Route {
    let parts: Vec<&str> = path.split('/').filter(|part| !part.is_empty()).collect();
    match parts.as_slice() {
        [] => Route::Home,
        ["users"] => Route::Users,
        ["users", id] => match id.parse() {
            Ok(id) => Route::User { id },
            Err(_) => Route::NotFound,
        },
        ["users", id, "posts"] => /* ... */,
        ["files", rest @ ..] if !rest.is_empty() => Route::File { path: rest.join("/") },
        _ => Route::NotFound,
    }
}
```

- `[]` is an empty list; `["users", id]` is exactly two parts, the first
  `"users"`, and the second named `id`.
- `..` is "and any number more"; `rest @ ..` names them.
- `if !rest.is_empty()` is a *guard*, an extra test after the pattern.
- `id.parse()` into a `u32` refuses `abc`, `-1` and `4.5`. Each is
  `NotFound`, not a page for user NaN.

And as always, the patterns must cover every shape. Remove the last arm,
and the compiler lists shapes nothing matches:

```
error[E0004]: non-exhaustive patterns: `&[&_]`, `&[&_, _]`, `&[&_, _, _]` and 1 more not covered
```

## Patterns take values apart

Patterns work on enums and structs too, and can hold values:

```rust
pub fn title(path: &str) -> String {
    match route(path) {
        Route::Home => "Home".to_string(),
        Route::User { id: 0 } => "The admin".to_string(),
        Route::User { id } => format!("User {id}"),
        Route::File { path } if path.ends_with(".md") => format!("Document {path}"),
        Route::File { path } => format!("File {path}"),
        // ...
    }
}
```

`Route::User { id: 0 }` matches only user 0; the next arm takes every
other id. Arms are tried top to bottom.

When you want one pattern, not a whole `match`, `let else` takes the
value apart or leaves the function:

```rust
pub fn user_id(path: &str) -> Option<u32> {
    let (Route::User { id } | Route::Posts { id }) = route(path) else {
        return None;
    };
    Some(id)
}
```

`|` means "or". Both variants have an `id`, so after this line `id` is
just there.

## What rust-js writes

The patterns become the checks you'd have written, with the shape's
conditions in one place:

```js
// rust/src/lib.js (generated)
export function route(path) {
  const parts = path.split("/").filter((part) => part !== "");
  if (parts.length === 0) {
    return { page: "home" };
  }
  if (parts.length === 1) {
    if (parts[0] === "users") {
      return { page: "users" };
    }
  } else if (parts.length === 2) {
    if (parts[0] === "users") {
      const id = parts[1];
      const parse = $parseInt(id, 0, 4294967295);
      return parse.TAG === "Ok" ? { page: "user", id: parse._0 } : { page: "not-found" };
    }
  }
  // ...
}
```

And `route` gives the same objects as the JavaScript's,
`{ page: "user", id: 42 }`, because of `#[rust_js::tag]` (chapter 9).

## Where it's different

- **Patterns are everywhere.** `let (x, y) = point;` takes a tuple
  apart, `for (i, item) in list.iter().enumerate()` too, and a function's
  parameter can be a pattern. JavaScript's destructuring, `const [a, b] =
  pair`, is the same idea, without the checking: a missing part is
  `undefined`.
- **Ranges and characters.** `'a'..='z'`, `90..`, `1 | 2 | 3`: chapter 6's
  `grade` was patterns too.

## Try it

Remove `_ => Route::NotFound,` from `route` and run `cargo build`: E0004,
with shapes no arm covers. Then visit `/users/abc` with the JavaScript
router: it's a page, for user NaN.
