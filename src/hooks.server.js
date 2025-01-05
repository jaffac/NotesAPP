// src/hooks.server.js
import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
  const protectedRoutes = ['/dashboard', '/profile', '/settings'];
  const publicRoutes = ['/login', '/signup'];

  const session = event.cookies.get('sb:token');
  const path = event.url.pathname;

  if (protectedRoutes.some((route) => path.startsWith(route))) {
    if (!session) {
      throw redirect(303, '/login');
    }
  }

  if (publicRoutes.includes(path) && session) {
    throw redirect(303, '/dashboard');
  }

  return resolve(event);
}
