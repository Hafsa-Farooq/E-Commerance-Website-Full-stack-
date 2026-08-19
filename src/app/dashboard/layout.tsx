import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardShell from "./DashboardShell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Clerk Metadata role check
  const role = (user.publicMetadata as { role?: string })?.role;
  const isAdmin = role === "admin";

  if (!isAdmin) {
    redirect("/");
  }

  return <DashboardShell>{children}</DashboardShell>;
}