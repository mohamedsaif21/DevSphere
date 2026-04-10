/**
 * Client-side session used for saved projects (localStorage).
 * Login/register pages set isLoggedIn + userEmail.
 */
export function getLocalSessionUserId(): string | null {
  if (typeof window === 'undefined') return null;
  if (localStorage.getItem('isLoggedIn') !== 'true') return null;
  const email = localStorage.getItem('userEmail');
  return email && email.trim() ? email.trim() : null;
}
