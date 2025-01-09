"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MealBox {
  id: string;
  status: string;
  createdAt: string;
  patient: {
    name: string;
    roomNumber: string;
    bedNumber: string;
  };
  dietChart: {
    mealType: string;
    items: string[];
    instructions: string[];
  };
}

interface PantryStaff {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    contactNumber: string;
  };
  location: string;
  mealBoxes: MealBox[];
}

interface NewPantryStaff {
  email: string;
  password: string;
  name: string;
  contactNumber: string;
  location: string;
}

interface UnassignedMealBox {
  id: string;
  status: string;
  createdAt: string;
  patient: {
    name: string;
    roomNumber: string;
    bedNumber: string;
  };
  dietChart: {
    mealType: string;
    items: string[];
    instructions: string[];
  };
}

export default function PantryStaffDashboard() {
  const [pantryStaff, setPantryStaff] = useState<PantryStaff[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isTasksDialogOpen, setIsTasksDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<PantryStaff | null>(null);
  const [newStaffData, setNewStaffData] = useState<NewPantryStaff>({
    email: "",
    password: "",
    name: "",
    contactNumber: "",
    location: "",
  });
  const [isAssignTaskDialogOpen, setIsAssignTaskDialogOpen] = useState(false);
  const [unassignedMealBoxes, setUnassignedMealBoxes] = useState<UnassignedMealBox[]>([]);
  const [selectedMealBoxIds, setSelectedMealBoxIds] = useState<string[]>([]);
  const [selectedPantryStaffId, setSelectedPantryStaffId] = useState<string>("");


  useEffect(() => {
    fetchPantryStaff();
    fetchUnassignedMealBoxes();
  }, []);

  const fetchUnassignedMealBoxes = async () => {
    try {
      const response = await axios.get("/api/meal-boxes/unassigned");
      setUnassignedMealBoxes(response.data);
    } catch (error) {
      console.error("Error fetching unassigned meal boxes:", error);
    }
  };

  const handleAssignTasks = async () => {
    try {
      await axios.post("/api/meal-boxes/assign", {
        mealBoxIds: selectedMealBoxIds,
        pantryStaffId: selectedPantryStaffId,
      });
      
      // Refresh data
      fetchPantryStaff();
      fetchUnassignedMealBoxes();
      
      // Reset selection
      setSelectedMealBoxIds([]);
      setSelectedPantryStaffId("");
      setIsAssignTaskDialogOpen(false);
    } catch (error) {
      console.error("Error assigning tasks:", error);
    }
  };

  const unassignedTaskColumns: ColumnDef<UnassignedMealBox, any>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
          className="w-4 h-4"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={(e) => {
            row.toggleSelected(!!e.target.checked);
            const mealBoxId = row.original.id;
            setSelectedMealBoxIds(prev =>
              e.target.checked
                ? [...prev, mealBoxId]
                : prev.filter(id => id !== mealBoxId)
            );
          }}
          className="w-4 h-4"
        />
      ),
    },
    {
      header: "Patient",
      accessorKey: "patient.name",
    },
    {
      header: "Room",
      cell: ({ row }) => (
        <span>
          {row.original.patient.roomNumber}-{row.original.patient.bedNumber}
        </span>
      ),
    },
    {
      header: "Meal Type",
      accessorKey: "dietChart.mealType",
    },
    {
      header: "Created",
      accessorKey: "createdAt",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
  ];


  const fetchPantryStaff = async () => {
    try {
      const response = await axios.get("/api/pantry-staff");
      setPantryStaff(response.data);
    } catch (error) {
      console.error("Error fetching pantry staff:", error);
    }
  };

  const handleAddPantryStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/pantry-staff", newStaffData);
      setIsAddDialogOpen(false);
      setNewStaffData({
        email: "",
        password: "",
        name: "",
        contactNumber: "",
        location: "",
      });
      fetchPantryStaff();
    } catch (error) {
      console.error("Error adding pantry staff:", error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-200 text-yellow-800",
      PREPARING: "bg-blue-200 text-blue-800",
      READY: "bg-green-200 text-green-800",
      DELIVERING: "bg-purple-200 text-purple-800",
      DELIVERED: "bg-gray-200 text-gray-800",
    };
    return colors[status] || "bg-gray-200 text-gray-800";
  };

  const taskColumns: ColumnDef<MealBox, any>[] = [
    {
      header: "Patient",
      accessorKey: "patient.name",
    },
    {
      header: "Room",
      cell: ({ row }) => (
        <span>
          {row.original.patient.roomNumber}-{row.original.patient.bedNumber}
        </span>
      ),
    },
    {
      header: "Meal Type",
      accessorKey: "dietChart.mealType",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <Badge className={getStatusColor(row.original.status)}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      header: "Created",
      accessorKey: "createdAt",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
  ];

  const columns: ColumnDef<PantryStaff, any>[] = [
    {
      header: "Name",
      accessorKey: "user.name",
    },
    {
      header: "Email",
      accessorKey: "user.email",
    },
    {
      header: "Contact Number",
      accessorKey: "user.contactNumber",
    },
    {
      header: "Location",
      accessorKey: "location",
    },
    {
      header: "Active Tasks",
      cell: ({ row }) => {
        const activeTasks = row.original.mealBoxes.filter(
          (box) => box.status !== "DELIVERED"
        ).length;
        return activeTasks;
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewTasks(row.original)}
          >
            View Tasks
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditStaff(row.original.id)}
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  const handleViewTasks = (staff: PantryStaff) => {
    setSelectedStaff(staff);
    setIsTasksDialogOpen(true);
  };

  const handleEditStaff = (staffId: string) => {
    // Implement edit logic
    console.log(staffId);
  };

  const handleGenerateMealBoxes = async () => {
    try {
      await axios.post("/api/meal-boxes/generate");
      // Refresh the unassigned meal boxes list
      fetchUnassignedMealBoxes();
    } catch (error) {
      console.error("Error generating meal boxes:", error);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pantry Staff Management</h1>
        <div className="space-x-4">
        <Button onClick={handleGenerateMealBoxes}>
            Generate Meal Boxes
          </Button>
          <Button onClick={() => setIsAssignTaskDialogOpen(true)}>
            Assign Tasks
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            Add New Staff
          </Button>
        </div>
      </div>

      <DataTable columns={columns} data={pantryStaff} />

      {/* Add Staff Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Pantry Staff</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddPantryStaff}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newStaffData.name}
                  onChange={(e) =>
                    setNewStaffData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newStaffData.email}
                  onChange={(e) =>
                    setNewStaffData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newStaffData.password}
                  onChange={(e) =>
                    setNewStaffData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input
                  id="contactNumber"
                  value={newStaffData.contactNumber}
                  onChange={(e) =>
                    setNewStaffData((prev) => ({
                      ...prev,
                      contactNumber: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newStaffData.location}
                  onChange={(e) =>
                    setNewStaffData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Tasks Dialog */}
      <Dialog open={isTasksDialogOpen} onOpenChange={setIsTasksDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Tasks for {selectedStaff?.user.name}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedStaff && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm">{selectedStaff.user.email}</p>
                  </div>
                  <div>
                    <Label>Contact</Label>
                    <p className="text-sm">{selectedStaff.user.contactNumber}</p>
                  </div>
                  <div>
                    <Label>Location</Label>
                    <p className="text-sm">{selectedStaff.location}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Meal Tasks</h3>
                  <DataTable 
                    columns={taskColumns} 
                    data={selectedStaff.mealBoxes} 
                  />
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isAssignTaskDialogOpen} onOpenChange={setIsAssignTaskDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Assign Tasks to Pantry Staff</DialogTitle>
          </DialogHeader>
          
          <div className="mb-4">
            <Label>Select Pantry Staff</Label>
            <Select
              value={selectedPantryStaffId}
              onValueChange={setSelectedPantryStaffId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select staff member" />
              </SelectTrigger>
              <SelectContent>
                {pantryStaff.map((staff) => (
                  <SelectItem key={staff.id} value={staff.id}>
                    {staff.user.name} ({staff.location})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Unassigned Meal Tasks</h3>
            <DataTable
              columns={unassignedTaskColumns}
              data={unassignedMealBoxes}
            />
          </div>

          <DialogFooter>
            <Button
              onClick={handleAssignTasks}
              disabled={!selectedPantryStaffId || selectedMealBoxIds.length === 0}
            >
              Assign Selected Tasks
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}