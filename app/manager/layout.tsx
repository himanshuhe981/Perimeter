import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { AppHeader } from "@/components/shared/AppHeader";
import { ManagerSidebar } from "@/components/manager/ManagerSidebar";

export default async function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  if (!user.role) redirect("/onboarding");
  if (user.role !== "MANAGER") redirect("/worker");

  return (
    <div className="flex flex-col md:flex-row flex-1" style={{ minHeight: "100vh" }}>
      <ManagerSidebar />
      <div className="flex flex-1 flex-col max-md:pb-[80px]" style={{ minWidth: 0 }}>
        <AppHeader user={user} showBrand={false} />
        <main style={{ flex: 1 }}>{children}</main>
      </div>
    </div>
  );
}
