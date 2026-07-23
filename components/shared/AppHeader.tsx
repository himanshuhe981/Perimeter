export function AppHeader({
  user,
}: {
  user: { email: string; name: string | null; role: string | null };
}) {
  return (
    <header className="flex items-center justify-between border-b border-black/10 px-6 py-3 dark:border-white/10">
      <span className="text-sm text-zinc-500">
        {user.name ?? user.email} — {user.role}
      </span>
      <a href="/auth/logout" className="text-sm underline">
        Log out
      </a>
    </header>
  );
}
