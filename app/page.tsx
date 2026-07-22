import { getCurrentUser } from "@/lib/getCurrentUser";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-zinc-50 px-6 text-center dark:bg-black">
      <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
        Perimeter
      </h1>

      {user ? (
        <div className="flex flex-col items-center gap-3">
          <p className="text-lg text-zinc-700 dark:text-zinc-300">
            Welcome, {user.name ?? user.email} — role: {user.role}
          </p>
          <a
            href="/auth/logout"
            className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-black"
          >
            Log out
          </a>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <a
            href="/auth/login"
            className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-black"
          >
            Log in
          </a>
          <a
            href="/auth/login?screen_hint=signup"
            className="rounded-full border border-black/20 px-5 py-2.5 text-sm font-medium text-black dark:border-white/20 dark:text-white"
          >
            Sign up
          </a>
        </div>
      )}
    </div>
  );
}
