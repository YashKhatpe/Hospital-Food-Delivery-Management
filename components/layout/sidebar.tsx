"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Utensils,
  Truck,
  ClipboardList,
  Settings,
} from "lucide-react";

const adminRoutes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
  },
  {
    label: "Patients",
    icon: Users,
    href: "/admin/patients",
  },
  {
    label: "Diet Charts",
    icon: ClipboardList,
    href: "/admin/diet-charts",
  },
  {
    label: "Pantry Staff",
    icon: Utensils,
    href: "/admin/pantry-staff",
  },
  {
    label: "Delivery Staff",
    icon: Truck,
    href: "/admin/delivery-staff",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },
];

const pantryRoutes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/pantry/dashboard",
  },
  {
    label: "Meal Preparation",
    icon: Utensils,
    href: "/pantry/meal-preparation",
  },
  {
    label: "Delivery Assignment",
    icon: Truck,
    href: "/pantry/delivery-assignment",
  },
];

const deliveryRoutes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/delivery/dashboard",
  },
  {
    label: "Deliveries",
    icon: Truck,
    href: "/delivery/tasks",
  },
];

interface SidebarProps {
  role: "ADMIN" | "PANTRY_STAFF" | "DELIVERY_STAFF";
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const routes = role === "ADMIN" 
    ? adminRoutes 
    : role === "PANTRY_STAFF" 
    ? pantryRoutes 
    : deliveryRoutes;

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-gray-100 text-gray-800">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold">Menu</h2>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-200",
                pathname === route.href ? "bg-gray-200 text-gray-900" : ""
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}