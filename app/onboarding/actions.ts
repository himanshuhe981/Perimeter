"use server";

import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import { prisma } from "@/lib/prisma";

export async function setRole(formData: FormData) {
  const session = await auth0.getSession();
  if (!session) redirect("/auth/login");

  const role = formData.get("role");
  if (role !== "MANAGER" && role !== "CARE_WORKER") {
    throw new Error("Invalid role");
  }

  await prisma.user.update({
    where: { auth0Id: session.user.sub },
    data: { role },
  });

  redirect(role === "MANAGER" ? "/manager" : "/worker");
}
