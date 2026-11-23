//! Chapter 21: npm is cargo. A crate is a package; a module is a file
//! inside it, declared with `mod`, private unless it says `pub`.
//!
//! Outside the crate, the private module can't be named:
//!
//! ```compile_fail,E0603
//! use chapter_21_npm_is_cargo::text::words;
//! ```

// The crate's modules, each a file: `src/text.rs`, private, and
// `src/posts.rs`, public.
mod text;
pub mod posts;

// `Post` re-exported at the crate's root: the front door, as a package's
// index.js re-exports what it offers.
pub use posts::Post;
