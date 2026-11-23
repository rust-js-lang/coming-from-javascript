//! Chapter 22: async. `async fn` and `.await`, as in JavaScript; a failure
//! is a `Result`, and a future is a value of its own type, which can't be
//! mistaken for what it will give.

/// A user.
#[derive(Debug, Clone, PartialEq)]
pub struct User {
    pub name: String,
    pub age: u32,
}

/// A user, answered later, as a server would: `ready` is a future done the
/// first time it's asked.
pub async fn load_user(id: u32) -> Result<User, String> {
    let user = match id {
        1 => Some(User { name: "Ada".to_string(), age: 36 }),
        2 => Some(User { name: "Grace".to_string(), age: 85 }),
        _ => None,
    };
    std::future::ready(user.ok_or(format!("no user {id}"))).await
}

/// A greeting for a user, or why not. Leave out the `.await` and
/// `load_user(id)` is a future: it has no `name`, and that doesn't compile.
pub async fn greeting(id: u32) -> String {
    match load_user(id).await {
        Ok(user) => format!("Hello, {}!", user.name),
        Err(why) => format!("sorry: {why}"),
    }
}

/// The users' ages added up, each loaded in turn: `?` passes the first
/// failure on, as in any function.
pub async fn total_age(ids: &[u32]) -> Result<u32, String> {
    let mut total = 0;
    for &id in ids {
        total += load_user(id).await?.age;
    }
    Ok(total)
}
