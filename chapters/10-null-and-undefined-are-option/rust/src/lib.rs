//! Chapter 10: `null` and `undefined` are `Option`. A value that may be
//! missing has a type that says so, `Option<T>`: `Some(value)` or `None`,
//! and it can't be used until the missing case is handled.

/// A profile. The fields that may be missing are `Option`s; `name` never is.
#[derive(Debug, Clone, PartialEq)]
pub struct Profile {
    pub name: String,
    pub nickname: Option<String>,
    pub volume: Option<u32>,
    pub manager_name: Option<String>,
}

/// What to call someone: their nickname, if they have one.
pub fn display_name(profile: &Profile) -> &str {
    profile.nickname.as_deref().unwrap_or(&profile.name)
}

/// Their volume, 0 to 100, or 50 if they never chose. `unwrap_or`
/// replaces `None` alone: `Some(0)`, a muted 0, stays 0.
pub fn volume(profile: &Profile) -> u32 {
    profile.volume.unwrap_or(50)
}

/// Someone by name, if they're there.
pub fn find<'a>(profiles: &'a [Profile], name: &str) -> Option<&'a Profile> {
    profiles.iter().find(|p| p.name == name)
}

/// What to call someone's manager. Each `?` returns `None` from the
/// function at once if what's before it is `None`.
pub fn managers_name(profiles: &[Profile], name: &str) -> Option<String> {
    let person = find(profiles, name)?;
    let manager = find(profiles, person.manager_name.as_deref()?)?;
    Some(display_name(manager).to_string())
}
