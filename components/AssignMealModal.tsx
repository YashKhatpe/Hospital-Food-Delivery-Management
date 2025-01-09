"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";

interface AssignMealModalProps {
  mealBoxId: string;
  deliveryPersonnelList: { id: string; name: string }[];
  onAssign: (mealBoxId: string, deliveryPersonnelId: string, selectedDeliveryPersonnelName: string) => void;
}

export const AssignMealModal: React.FC<AssignMealModalProps> = ({
  mealBoxId,
  deliveryPersonnelList,
  onAssign,
}) => {
  const [selectedDeliveryPersonnel, setSelectedDeliveryPersonnel] = useState<string | null>(null);
  
  const [isOpen, setIsOpen] = useState(false);
  const handleAssign = async () => {
    if (!selectedDeliveryPersonnel) return;
  
    try {
      const res = await fetch(`/api/delivery-personnel/${selectedDeliveryPersonnel}`);
      if (!res.ok) {
        throw new Error("Failed to fetch delivery personnel details.");
      }
  
      const data = await res.json();
  
      // Proceed with assigning the task after setting the name
      onAssign(mealBoxId, selectedDeliveryPersonnel, data.name);
  
      // Close the modal
      setIsOpen(false);
    } catch (error) {
      console.error("Error fetching delivery personnel details:", error);
    }
  };
  

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">
          Assign Task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Delivery Personnel</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select onValueChange={(value) => setSelectedDeliveryPersonnel(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Delivery Personnel" />
            </SelectTrigger>
            <SelectContent>
              {deliveryPersonnelList.map((personnel) => (
                <SelectItem key={personnel.id} value={personnel.id}>
                  {personnel.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button onClick={handleAssign} disabled={!selectedDeliveryPersonnel}>
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
