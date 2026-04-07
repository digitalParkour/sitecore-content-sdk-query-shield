/** Normalize GraphQL query string for stable hashing (strip comments, trim, collapse whitespace). */
export function normalizeQuery(query: string): string {
  return query
    .trim()
    .replace(/#[^\n]*/g, '') // remove GraphQL line comments (# to EOL)
    .replace(/\s+/g, ' ')
    .replace(/\s*\{\s*/g, '{')
    .replace(/\s*\}\s*/g, '}')
    .replace(/\s*\(\s*/g, '(')
    .replace(/\s*\)\s*/g, ')')
    .replace(/\s+/g, ' ')
    .trim();
}
