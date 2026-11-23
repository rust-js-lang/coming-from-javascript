// Chapter 10: missing values in JavaScript, `undefined` and `null`, beside
// `rust/src/lib.rs`'s `Option`.
//
// A profile: { name, nickname?, volume?, managerName? }

// What to call someone: their nickname, if they have one.
export const displayName = (profile) => profile.nickname ?? profile.name

// Their volume, 0 to 100, or 50 if they never chose. `||` replaces every
// falsy value, so a muted 0 becomes 50.
export const volume = (profile) => profile.volume || 50

// The same with `??`, which replaces only undefined and null.
export const volumeKept = (profile) => profile.volume ?? 50

// Someone by name, if they're there: `find` gives undefined if not.
export const find = (profiles, name) => profiles.find((p) => p.name === name)

// What to call someone's manager: each `?.` stops at a missing value.
export function managersName(profiles, name) {
  const managerName = find(profiles, name)?.managerName
  const manager = managerName === undefined ? undefined : find(profiles, managerName)
  return manager === undefined ? undefined : displayName(manager)
}
