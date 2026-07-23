import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { AppHeader } from "@/components/shared/AppHeader";

export default async function WorkerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  if (!user.role) redirect("/onboarding");
  if (user.role !== "CARE_WORKER") redirect("/manager");

  return (
    <div className="flex flex-1 flex-col">
      <AppHeader user={user} />
      {children}
    </div>
  );
}
