import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return <AdminShell username={user.username}>{children}</AdminShell>;
}
