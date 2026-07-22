import { auth0 } from "@/lib/auth0";
import { prisma } from "@/lib/prisma";

/**
 * Resolves the signed-in user for the current request, upserting a matching
 * Prisma `User` row on first login. Auth0 only proves identity; `role` is
 * always read from our own database, never trusted from the Auth0 session.
 */
export async function getCurrentUser() {
  const session = await auth0.getSession();
  if (!session) return null;

  const { sub, email, name } = session.user;
  if (!email) {
    throw new Error(`Auth0 session for ${sub} has no email claim`);
  }

  return prisma.user.upsert({
    where: { auth0Id: sub },
    update: { email, name },
    create: { auth0Id: sub, email, name },
  });
}
