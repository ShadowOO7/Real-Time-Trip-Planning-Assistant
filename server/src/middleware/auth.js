// Optional JWT middleware (not enforced in demo)
export function requireAuth(req, res, next) {
  next();
}
