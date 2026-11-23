//! Chapter 17: pattern matching. A pattern describes a shape; matching a
//! value against it checks the shape and takes the value apart in one step.

/// The page a path is.
#[derive(Debug, Clone, PartialEq)]
#[cfg_attr(rust_js, rust_js::tag = "page")]
pub enum Route {
    #[cfg_attr(rust_js, rust_js::name = "home")]
    Home,
    #[cfg_attr(rust_js, rust_js::name = "users")]
    Users,
    #[cfg_attr(rust_js, rust_js::name = "user")]
    User { id: u32 },
    #[cfg_attr(rust_js, rust_js::name = "posts")]
    Posts { id: u32 },
    #[cfg_attr(rust_js, rust_js::name = "file")]
    File { path: String },
    #[cfg_attr(rust_js, rust_js::name = "not-found")]
    NotFound,
}

/// The page a path is, by the shape of its parts: a slice pattern for each
/// route, `..` for "and the rest", `@` to name what matched.
pub fn route(path: &str) -> Route {
    let parts: Vec<&str> = path.split('/').filter(|part| !part.is_empty()).collect();
    match parts.as_slice() {
        [] => Route::Home,
        ["users"] => Route::Users,
        ["users", id] => match id.parse() {
            Ok(id) => Route::User { id },
            Err(_) => Route::NotFound,
        },
        ["users", id, "posts"] => match id.parse() {
            Ok(id) => Route::Posts { id },
            Err(_) => Route::NotFound,
        },
        ["files", rest @ ..] if !rest.is_empty() => Route::File { path: rest.join("/") },
        _ => Route::NotFound,
    }
}

/// The page's title. A guard, `if`, after a pattern adds a test of its own.
pub fn title(path: &str) -> String {
    match route(path) {
        Route::Home => "Home".to_string(),
        Route::Users => "Everyone".to_string(),
        Route::User { id: 0 } => "The admin".to_string(),
        Route::User { id } => format!("User {id}"),
        Route::Posts { id } => format!("Posts by user {id}"),
        Route::File { path } if path.ends_with(".md") => format!("Document {path}"),
        Route::File { path } => format!("File {path}"),
        Route::NotFound => "Not found".to_string(),
    }
}

/// The user a path is about, if it's a user's page: `let else` takes the
/// pattern apart, or leaves.
pub fn user_id(path: &str) -> Option<u32> {
    let (Route::User { id } | Route::Posts { id }) = route(path) else {
        return None;
    };
    Some(id)
}
