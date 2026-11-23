# 19. Borrowing

Chapter 18 gave every value one owner. Moving a value into every
function that reads it would be clumsy, so most of the time you *lend*
it: a *reference* lets code use a value without owning it.

## Two kinds of reference

- **`&T` lends to read.** Any number can exist at once.
- **`&mut T` lends to change.** Only one can exist at a time, and while
  it does, there are no `&T`s either.

```rust
// rust/src/lib.rs
pub fn pending_count(tasks: &[Task]) -> usize          // reads
pub fn mark_all_done(tasks: &mut [Task])              // changes each
pub fn remove_done(tasks: &mut Vec<Task>)             // changes the list
```

The caller writes it too: `pending_count(&tasks)`, `remove_done(&mut
tasks)` (chapter 3). The rule fits in one line: **many readers, or one
writer, never both.** It's the rule a database or a file lock follows,
checked by the compiler for every value.

## The bug it rules out

Remove the done tasks. The JavaScript that looks right:

```js
// js/tasks.js
export function removeDoneWithSplice(tasks) {
  tasks.forEach((task, i) => {
    if (task.done) tasks.splice(i, 1)
  })
}
```

```
remove the done tasks from [["milk",true],["eggs",true],["bread",false],["tea",true]]
  js, splice in forEach: ["eggs","bread"]
  js, backwards:         ["bread"]
  rust, retain:          ["bread"]
```

`eggs` survived. Removing `milk` shifts every task left, `eggs` moves
into slot 0, and the loop moves on to slot 1. The loop is *reading* the
array while `splice` *writes* it: a reader and a writer at once.

In Rust, the same loop doesn't compile:

```rust
for (i, task) in tasks.iter().enumerate() {    // a reader...
    if task.done {
        tasks.remove(i);                        // ...and a writer
    }
}
```

```
error[E0502]: cannot borrow `tasks` as mutable because it is also borrowed as immutable
```

You write `retain` instead, which walks and removes in one careful step:

```rust
pub fn remove_done(tasks: &mut Vec<Task>) {
    tasks.retain(|task| !task.done);
}
```

## A reference can't go stale

The rule catches a subtler case too. Hold a reference to the first task,
then add a task:

```rust
let first = &tasks[0];
tasks.push(Task { title: "eggs".into(), done: false });
println!("{}", first.title);
```

```
error[E0502]: cannot borrow `tasks` as mutable because it is also borrowed as immutable
```

In JavaScript this would be fine, since the garbage collector keeps the
task alive. In Rust, a `Vec` that grows may move its items to a bigger
block of memory, and `first` would point at where the task *used* to be.
The rule stops that before it can happen, at no cost while the program
runs.

## Changing two parts at once

`swap_ends` swaps the first task and the last. Taking two `&mut`s into one
list would be two writers, so the list does it for you:

```rust
pub fn swap_ends(tasks: &mut [Task]) {
    if tasks.len() > 1 {
        let last = tasks.len() - 1;
        tasks.swap(0, last);
    }
}
```

## What rust-js writes

The checks are all at compile time, so the JavaScript is plain array
code:

```js
// rust/src/lib.js (generated)
export function markAllDone(tasks) {
  for (const task of tasks) {
    task.done = true;
  }
}

export function removeDone(tasks) {
  $retain(tasks, (task) => !task.done);
}

export function swapEnds(tasks) {
  if (tasks.length > 1) {
    const last = tasks.length - 1;
    [tasks[0], tasks[last]] = [tasks[last], tasks[0]];
  }
}
```

And the `.d.ts` tells your editor which functions only read:
`pendingCount(tasks: readonly Task[])`, against `removeDone(tasks:
Task[])`.

## Where it's different

- **A borrow lasts until its last use.** Not until the end of the block:
  `let first = &tasks[0]; println!("{}", first.title); tasks.push(..)`
  compiles, because `first` is done before the push.
- **Methods borrow too.** `&self` and `&mut self` (chapter 7) are the same
  two kinds of reference.

## Try it

Write the `for` loop with `tasks.remove(i)` above in a test and run
`cargo test`: E0502. Then move the `println!` of `first.title` to before
the `push` in the second example: it compiles, since the reader is done
before the writer starts.
