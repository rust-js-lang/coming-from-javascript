// bun chapters/10-null-and-undefined-are-option/compare.js: the team, both ways.
import * as js from './js/profiles.js'
import * as rust from './rust/src/lib.js'
import { team } from './team.js'

for (const person of team) {
  console.log(person.name)
  console.log(`  volume          js (||): ${String(js.volume(person)).padEnd(4)} js (??): ${String(js.volumeKept(person)).padEnd(4)} rust: ${rust.volume(person)}`)
  console.log(`  manager's name  js: ${String(js.managersName(team, person.name)).padEnd(14)} rust: ${rust.managersName(team, person.name)}`)
}
