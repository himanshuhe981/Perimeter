import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { setRole } from "./actions";

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  if (user.role) redirect("/");

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-2xl font-semibold">Welcome to Perimeter</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Tell us how you&apos;ll be using the app.
      </p>
      <form action={setRole} className="flex flex-col gap-3 sm:flex-row">
        <button
          name="role"
          value="MANAGER"
          className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          I&apos;m a Manager
        </button>
        <button
          name="role"
          value="CARE_WORKER"
          className="rounded-full border border-black/20 px-5 py-2.5 text-sm font-medium dark:border-white/20"
        >
          I&apos;m a Care Worker
        </button>
      </form>
    </div>
  );
}
