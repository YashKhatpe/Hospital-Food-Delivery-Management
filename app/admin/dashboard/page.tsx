"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  UtensilsCrossed,
  Truck,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

interface DashboardMetrics {
  totalPatients: number;
  mealsInPreparation: number;
  activeDeliveries: number;
  pendingTasks: number;
}

export default function AdminDashboard() {
  const [patientCount, setPatientCount] = useState(0);
  const [mealBoxesCount, setMealBoxesCount] = useState(0);
  const [activeDeliveriesCount, setActiveDeliveriesCount] = useState(0);
  const [pendingTasksCount, setPendingTasksCount] = useState(0);

  useEffect(() => {
    fetchPatientCounts();
    fetchMealCounts();
  }, []);

  const fetchPatientCounts = async () => {
    fetch("/api/counts/patients")
      .then((res) => res.json())
      .then((data) => {
        setPatientCount(data.patientCount);
      });
  };
  const fetchMealCounts = async () => {
    fetch("/api/counts/meal")
      .then((res) => res.json())
      .then((data) => {
        setMealBoxesCount(data.preparingCount);
        setActiveDeliveriesCount(data.deliveringCount);
        setPendingTasksCount(data.pendingCount);
      });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of hospital food management system
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Patients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patientCount}</div>
            <p className="text-xs text-muted-foreground">
              Active patient records
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Meals in Preparation
            </CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mealBoxesCount}</div>
            <p className="text-xs text-muted-foreground">
              Currently being prepared
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Deliveries
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDeliveriesCount}</div>
            <p className="text-xs text-muted-foreground">In transit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasksCount}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Overview of recent food service activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* TODO: Add activity chart */}
            <div className="h-[200px] flex items-center justify-center border rounded-md">
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Alerts</CardTitle>
            <CardDescription>Recent system notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Example alerts - replace with real data */}
              <div className="flex items-center gap-4 rounded-lg border p-4">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Low Stock Alert</p>
                  <p className="text-sm text-muted-foreground">
                    Some dietary items are running low
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-lg border p-4">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Delayed Delivery</p>
                  <p className="text-sm text-muted-foreground">
                    Room 302 meal delivery is delayed
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
