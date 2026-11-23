// Chapter 19: a to-do list in JavaScript, where any code holding the array
// can read or change it at any moment, beside `rust/src/lib.rs`'s borrows.
//
// A task: { title, done }

// How many aren't done.
export const pendingCount = (tasks) => tasks.filter((t) => !t.done).length

// Marks every task done, in place.
export function markAllDone(tasks) {
  for (const task of tasks) task.done = true
}

// Removes the done tasks, in place, the way that looks right: `splice`
// inside the loop. Each removal shifts the rest left, and the loop steps
// past the task that moved into the gap.
export function removeDoneWithSplice(tasks) {
  tasks.forEach((task, i) => {
    if (task.done) tasks.splice(i, 1)
  })
}

// The same, the way that works: walk backwards.
export function removeDone(tasks) {
  for (let i = tasks.length - 1; i >= 0; i--) {
    if (tasks[i].done) tasks.splice(i, 1)
  }
}

// Swaps the first task and the last.
export function swapEnds(tasks) {
  if (tasks.length > 1) [tasks[0], tasks[tasks.length - 1]] = [tasks[tasks.length - 1], tasks[0]]
}
