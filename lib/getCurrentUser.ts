import { auth0 } from "@/lib/auth0";
import { prisma } from "@/lib/prisma";

/**
 * Resolves the signed-in user for the current request, upserting a matching
 * Prisma `User` row on first login. Auth0 only proves identity; `role` is
 * always read from our own database, never trusted from the Auth0 session.
 *
 * Keyed on email rather than auth0Id: Auth0 treats the same email address
 * logging in via different methods (e.g. Google vs. username/password) as
 * separate identities with different `sub` values unless account linking is
 * configured, which this project doesn't set up. Keying on email means a
 * given address always maps to one User row, with auth0Id updated to
 * whichever identity most recently authenticated as that email — a known,
 * documented simplification rather than true cross-provider account linking.
 */
export async function getCurrentUser() {
  const session = await auth0.getSession();
  if (!session) return null;

  const { sub, email, name } = session.user;
  if (!email) {
    throw new Error(`Auth0 session for ${sub} has no email claim`);
  }

  return prisma.user.upsert({
    where: { email },
    update: { auth0Id: sub, name },
    create: { auth0Id: sub, email, name },
  });
}
