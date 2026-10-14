/**
 * URL for a file in /public. The app is served under a base path
 * (`/mech-interp-presentation/` on njitaisafety.org), so absolute paths
 * like '/images/x.png' need that prefix.
 */
export const asset = (path: string) => import.meta.env.BASE_URL + path.replace(/^\//, '')
