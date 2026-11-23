// The package's front door: what it re-exports is its API, as `pub use`
// makes the crate's. text.js stays out of it, though anyone can still
// import it directly.
export { index, readingMinutes, slug } from './posts.js'
