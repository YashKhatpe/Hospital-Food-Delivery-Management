"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/data-table";
import axios from "axios";
import { DietChart, Patient } from "@/types/types";
import { MealType } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

export default function DietChartsPage() {
  const [dietCharts, setDietCharts] = useState<DietChart[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [newDietChart, setNewDietChart] = useState<Partial<DietChart>>({
    patientId: "",
    mealType: "MORNING",
    items: [],
    instructions: [],
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch diet charts and patients
  useEffect(() => {
    const fetchDietCharts = async () => {
      try {
        const response = await axios.get("/api/diet-charts");
        setDietCharts(response.data);
      } catch (err) {
        console.error("Error fetching diet charts:", err);
      }
    };

    const fetchPatients = async () => {
      try {
        const response = await axios.get("/api/patients");
        setPatients(response.data);
      } catch (err) {
        console.error("Error fetching patients:", err);
      }
    };

    fetchDietCharts();
    fetchPatients();
  }, []);

  // Handle adding a new diet chart
  const handleAddDietChart = async () => {
    try {
      // Send the diet chart data as an object with string[] for items and instructions
      const formattedDietChart = {
        ...newDietChart,
        // 'items' and 'instructions' should be an array of strings
        items: newDietChart.items || [], // Ensure it's an array
        instructions: newDietChart.instructions || [], // Ensure it's an array
      };

      const response = await axios.post("/api/diet-charts", formattedDietChart);
      setDietCharts((prev) => [...prev, response.data]);
      setIsDialogOpen(false);
      setNewDietChart({
        patientId: "",
        mealType: "MORNING",
        items: [],
        instructions: [],
      });
    } catch (err) {
      console.error("Error adding diet chart:", err);
    }
  };
  
  // Columns for the data table
  const columns: ColumnDef<DietChart, any>[] = [
    { 
      header: "Patient Name",
      accessorKey: "patient.name"
    },
    { 
      header: "Meal Type",
      accessorKey: "mealType"
    },
    {
      header: "Items",
      accessorKey: "items",
      cell: ({ row }) => {
        const items = row.original.items;
        return Array.isArray(items) ? items.join(", ") : "No items";
      }
    },
    {
      header: "Instructions",
      accessorKey: "instructions",
      cell: ({ row }) => {
        const instructions = row.original.instructions;
        return Array.isArray(instructions) ? instructions.join(", ") : "No instructions";
      }
    },
    { 
      header: "Created At",
      accessorKey: "createdAt",
      cell: ({ row }) => {
        return new Date(row.original.createdAt).toLocaleDateString();
      }
    }
  ];
  


  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-semibold">Diet Charts</h1>
        <Button onClick={() => setIsDialogOpen(true)}>Add Diet Chart</Button>
      </div>

      {/* Data Table */}
      <DataTable columns={columns} data={dietCharts} />

      {/* Add Diet Chart Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          {/* <Button>Add Diet Chart</Button> */}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Diet Chart</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddDietChart();
            }}
          >
            <Select
              value={newDietChart.patientId}
              onValueChange={(value) =>
                setNewDietChart((prev) => ({ ...prev, patientId: value }))
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={newDietChart.mealType}
              onValueChange={(value: MealType) =>
                setNewDietChart((prev) => ({ ...prev, mealType: value }))
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Meal Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MORNING">Morning</SelectItem>
                <SelectItem value="EVENING">Evening</SelectItem>
                <SelectItem value="NIGHT">Night</SelectItem>
              </SelectContent>
            </Select>

            <Textarea
              placeholder="Items (comma-separated)"
              value={newDietChart.items?.join(", ") || ""} // Safely join items if they exist, otherwise fallback to empty string
              onChange={(e) =>
                setNewDietChart((prev) => ({
                  ...prev,
                  items:
                    e.target.value.split(",").map((item) => item.trim()) || [], // Ensure it's an array, fallback to empty array if undefined
                }))
              }
              required
            />

            <Textarea
              placeholder="Instructions (comma-separated)"
              value={newDietChart.instructions?.join(", ") || ""} // Display as a string in the Textarea
              onChange={(e) =>
                setNewDietChart((prev) => ({
                  ...prev,
                  instructions: e.target.value
                    .split(",")
                    .map((instruction) => instruction.trim()) || [], // Split by comma to make it an array
                }))
              }
              required
            />

            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
