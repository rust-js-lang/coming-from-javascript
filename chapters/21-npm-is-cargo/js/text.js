// Text helpers. A file is a module, and what it exports, any importer can
// use: there's no "this package only".

// A title in kebab case, "Hello World" as "hello-world", "JavaScript" as
// "java-script",
// by hand, with no dependency.
export const kebab = (title) =>
  (title.match(/[A-Z]+(?![a-z])|[A-Z]?[a-z]+|\d+/g) ?? []).map((word) => word.toLowerCase()).join('-')

// How many words the text has.
export const words = (text) => text.split(/\s+/).filter(Boolean).length
