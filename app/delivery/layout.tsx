
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { cookies } from 'next/headers'
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;

  if (!role || role !== "DELIVERY_STAFF") {
    redirect("/login");
  }


  return <DashboardLayout role="DELIVERY_STAFF">{children}</DashboardLayout>;
}