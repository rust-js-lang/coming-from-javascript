// Chapter 17: a URL router in JavaScript, reading a path's parts by index
// and length, beside `rust/src/lib.rs`'s patterns.

// The page a path is: { page: 'home' }, { page: 'user', id }, ...
export function route(path) {
  const parts = path.split('/').filter((part) => part !== '')
  if (parts.length === 0) return { page: 'home' }
  if (parts[0] === 'users' && parts.length === 1) return { page: 'users' }
  if (parts[0] === 'users' && parts.length === 2) return { page: 'user', id: Number(parts[1]) }
  if (parts[0] === 'users' && parts.length === 3 && parts[2] === 'posts') {
    return { page: 'posts', id: Number(parts[1]) }
  }
  if (parts[0] === 'files' && parts.length > 1) return { page: 'file', path: parts.slice(1).join('/') }
  return { page: 'not-found' }
}

// The page's title. `/users/abc` is user NaN, which Number() made.
export function title(path) {
  const r = route(path)
  switch (r.page) {
    case 'home':
      return 'Home'
    case 'users':
      return 'Everyone'
    case 'user':
      return r.id === 0 ? 'The admin' : `User ${r.id}`
    case 'posts':
      return `Posts by user ${r.id}`
    case 'file':
      return r.path.endsWith(".md") ? `Document ${r.path}` : `File ${r.path}`
    default:
      return 'Not found'
  }
}
