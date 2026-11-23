// The team every case asks about, as rust/tests/native.rs has it: a
// missing nickname, volume or manager is a property left out.
export const team = [
  { name: 'Ada', nickname: 'Countess', volume: 0 },
  { name: 'Grace', managerName: 'Ada' },
  { name: 'Linus', nickname: 'Tux', volume: 80, managerName: 'Grace' },
  { name: 'Alan', managerName: 'Turing' },
]
