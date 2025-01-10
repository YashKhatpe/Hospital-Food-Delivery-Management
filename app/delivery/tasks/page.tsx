"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";

interface MealDelivery {
  id: string;
  status: "DELIVERING" | "DELIVERED";
  createdAt: string;
  deliveryNotes: string | null;
  patient: {
    name: string;
    roomNumber: string;
    bedNumber: string;
    floorNumber: string;
    contactNumber: string;
  };
  dietChart: {
    mealType: string;
    items: string[];
    instructions: string[];
  };
}

export default function DeliveryStaffTasks() {
  const [deliveries, setDeliveries] = useState<MealDelivery[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<MealDelivery | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const response = await axios.get("/api/delivery-staff/deliveries");
      setDeliveries(response.data);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
    }
  };

  const handleMarkDelivered = async (mealBoxId: string, notes: string) => {
    setIsLoading(true);
    try {
      await axios.post(`/api/meal-boxes/${mealBoxId}/complete`, {
        deliveryNotes: notes,
      });
      fetchDeliveries();
      setIsDetailsDialogOpen(false);
      setSelectedDelivery(null);
      setDeliveryNotes("");
    } catch (error) {
      console.error("Error marking delivery as complete:", error);
    }
    setIsLoading(false);
  };

  const columns: ColumnDef<MealDelivery>[] = [
    {
      header: "Patient",
      accessorKey: "patient.name",
    },
    {
      header: "Location",
      cell: ({ row }) => {
        const patient = row.original.patient;
        return `Floor ${patient.floorNumber}, Room ${patient.roomNumber}-${patient.bedNumber}`;
      },
    },
    {
      header: "Meal Type",
      accessorKey: "dietChart.mealType",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <Badge 
          className={
            row.original.status === "DELIVERED" 
              ? "bg-green-200 text-green-800" 
              : "bg-blue-200 text-blue-800"
          }
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedDelivery(row.original);
              setIsDetailsDialogOpen(true);
            }}
          >
            View Details
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Deliveries</h1>
      </div>

      <DataTable columns={columns} data={deliveries} />

      {/* Delivery Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Delivery Details</DialogTitle>
          </DialogHeader>
          
          {selectedDelivery && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Patient Details</h3>
                  <p>Name: {selectedDelivery.patient.name}</p>
                  <p>Floor: {selectedDelivery.patient.floorNumber}</p>
                  <p>Room: {selectedDelivery.patient.roomNumber}</p>
                  <p>Bed: {selectedDelivery.patient.bedNumber}</p>
                  <p>Contact: {selectedDelivery.patient.contactNumber}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Meal Details</h3>
                  <p>Type: {selectedDelivery.dietChart.mealType}</p>
                  <p>Items: {selectedDelivery.dietChart.items.join(", ")}</p>
                  <div className="mt-2">
                    <h4 className="font-medium">Special Instructions:</h4>
                    <ul className="list-disc pl-4">
                      {selectedDelivery.dietChart.instructions.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {selectedDelivery.status === "DELIVERING" && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Delivery Notes</h3>
                  <Textarea
                    placeholder="Add any delivery notes or comments..."
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                  />
                  <Button 
                    className="w-full"
                    onClick={() => handleMarkDelivered(selectedDelivery.id, deliveryNotes)}
                    disabled={isLoading}
                  >
                    {isLoading ? "Marking as Delivered..." : "Mark as Delivered"}
                  </Button>
                </div>
              )}

              {selectedDelivery.status === "DELIVERED" && (
                <div>
                  <h3 className="font-semibold">Delivery Notes</h3>
                  <p>{selectedDelivery.deliveryNotes || "No delivery notes"}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}