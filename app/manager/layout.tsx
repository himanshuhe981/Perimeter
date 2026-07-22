import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/getCurrentUser";

export default async function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  if (!user.role) redirect("/onboarding");
  if (user.role !== "MANAGER") redirect("/worker");

  return <>{children}</>;
}
