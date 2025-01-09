import { Header } from "./header";
import { Sidebar } from "./sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "ADMIN" | "PANTRY_STAFF" | "DELIVERY_STAFF";
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  return (
    <div className="h-screen">
      <Header />
      <div className="flex h-[calc(100vh-4rem)]">
        <aside className="hidden md:flex md:w-64 md:flex-col">
          <Sidebar role={role} />
        </aside>
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}