// A blog's posts: { title, body }.
import { kebab, words } from './text.js'

// Its address: its title in kebab case.
export const slug = (post) => kebab(post.title)

// Minutes to read it, at 200 words a minute, at least 1.
export const readingMinutes = (post) => Math.max(Math.ceil(words(post.body) / 200), 1)

// The blog's index: each post's slug and reading time.
export const index = (posts) => posts.map((post) => `/${slug(post)} (${readingMinutes(post)} min)`)
