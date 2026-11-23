//! Text helpers, for this crate's own modules: `pub(crate)`, anywhere in
//! the crate and nowhere outside it.

use heck::ToKebabCase;

/// A title in kebab case, "Hello World" as "hello-world", "JavaScript" as
/// "java-script",
/// by the `heck` crate's `to_kebab_case`.
pub(crate) fn kebab(title: &str) -> String {
    title.to_kebab_case()
}

/// How many words the text has.
pub(crate) fn words(text: &str) -> usize {
    text.split_whitespace().count()
}
