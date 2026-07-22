import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/getCurrentUser";

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Perimeter</h1>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <a href="/auth/login" className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-black">
            Log in
          </a>
          <a href="/auth/login?screen_hint=signup" className="rounded-full border border-black/20 px-5 py-2.5 text-sm font-medium dark:border-white/20">
            Sign up
          </a>
        </div>
      </div>
    );
  }

  if (!user.role) redirect("/onboarding");
  redirect(user.role === "MANAGER" ? "/manager" : "/worker");
}
