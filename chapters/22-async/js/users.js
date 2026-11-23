// Chapter 22: async in JavaScript, beside `rust/src/lib.rs`'s.

const users = { 1: { name: 'Ada', age: 36 }, 2: { name: 'Grace', age: 85 } }

// A user, answered later, as a server would. It throws for one it doesn't know.
export async function loadUser(id) {
  const user = await Promise.resolve(users[id])
  if (user === undefined) throw new Error(`no user ${id}`)
  return user
}

// A greeting for a user, or why not.
export async function greeting(id) {
  try {
    const user = await loadUser(id)
    return `Hello, ${user.name}!`
  } catch (error) {
    return `sorry: ${error.message}`
  }
}

// The same with the `await` forgotten: `user` is a Promise, which has no
// `name`, so the greeting says undefined. And the promise for an unknown
// user rejects with nobody to catch it.
export function greetingForgotten(id) {
  const user = loadUser(id)
  user.catch(() => {})
  return `Hello, ${user.name}!`
}

// The users' ages added up: each loaded in turn.
export async function totalAge(ids) {
  let total = 0
  for (const id of ids) total += (await loadUser(id)).age
  return total
}
