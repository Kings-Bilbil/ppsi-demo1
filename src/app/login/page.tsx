import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login Admin",
};

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect("/admin");
  return <LoginForm />;
}
