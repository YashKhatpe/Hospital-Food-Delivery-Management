"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    console.log("User state in Home: ", user);
    if (user == null) {
      router.push("/login");
      return;
    }

    if (user.role === "ADMIN") {
      router.push("/admin/dashboard");
    } else if (user.role === "PANTRY_STAFF") {
      router.push("/pantry/dashboard");
    } else if (user.role === "DELIVERY_STAFF") {
      router.push("/delivery/dashboard");
    }
  }, [user, router]);

  return null;
}
