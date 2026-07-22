import { getCurrentUser } from "@/lib/getCurrentUser";

export async function createContext() {
  const dbUser = await getCurrentUser();
  return { dbUser };
}

export type GraphQLContext = Awaited<ReturnType<typeof createContext>>;
