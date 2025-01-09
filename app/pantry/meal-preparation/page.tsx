"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MealBox, MealStatus } from "@/types/types";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { AssignMealModal } from "@/components/AssignMealModal";
export default function MealPreparation() {
  const [mealBoxes, setMealBoxes] = useState<MealBox[]>([]);
  const [loading, setLoading] = useState(false);
  const [deliveryPersonnelList, setDeliveryPersonnelList] = useState([]);
  const [assignedPerson, setAssignedPerson] = useState("Unassigned");

  const userString = localStorage.getItem("user");


  // Fetching delivery personnels
 // Fetching delivery personnels
useEffect(() => {
  setLoading(true); // Set loading to true before the fetch begins
  fetch("/api/delivery-personnel")
    .then((res) => res.json())
    .then((data) => {
      setDeliveryPersonnelList(data);
      setLoading(false); // Set loading to false after data is fetched
    })
    .catch(() => {
      setLoading(false); // Set loading to false in case of an error
    });
}, []);
  // Fetch meal boxes assigned to the logged-in pantry staff
  useEffect(() => {
    if (userString) {
      try {
        // Parse the JSON string into an object
        const user = JSON.parse(userString);

        // Access the id property
        const userId = user.id;

        console.log("User ID:", userId);

        fetch(`/api/meal-boxes?pantryStaffId==${userId}`)
          .then((res) => res.json())
          .then((data) => {
            setMealBoxes(data);
            console.log("Fetching Meal Boxes: ", data);
          });
      } catch (error) {
        console.error("Error parsing user object from local storage:", error);
      }
    } else {
      console.log("User not found in local storage.");
    }
  }, [userString]);


  const assignDeliveryPersonnel = async (mealBoxId: string, deliveryPersonnelId: string, selectedDeliveryPersonnelName: string) => {
    // Replace with actual API call
    try {
      const res = await fetch(`/api/meal-boxes/${mealBoxId}/assign-delivery` , {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deliveryPersonnelId })
      })
      if(res.ok){
        console.log(`Assigning delivery personnel ${deliveryPersonnelId} to meal box ${mealBoxId}`);
        setAssignedPerson(selectedDeliveryPersonnelName);
      }
      
    } catch (error: any) {
      console.log("Error while assigning delivery personnel", error.message);
    }
  };

  const updateMealBoxStatus = async (id: string, status: MealStatus) => {
    await fetch("/api/meal-boxes/assign", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mealBoxId: id, status }),
    });

    // Update local state
    setMealBoxes((prev) =>
      prev.map((box) => (box.id === id ? { ...box, status } : box))
    );
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "Meal ID",
      cell: ({ row }) => row.original.id,
    },
    {
      accessorKey: "patientName",
      header: "Patient Name",
      cell: ({ row }) => row.original.patient.name,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const isPreparing = status === "PREPARING";
        const isReady = status === "READY";
    
        return (
          <div className="flex items-center space-x-2">
            <span className="pr-4">{status}</span>
            {isPreparing && (
              <Button
                size="sm"
                onClick={async () => {
                  await updateMealBoxStatus(row.original.id, "READY");
                }}
              >
                Mark as Ready
              </Button>
            )}
            {isReady && <span className="text-green-500">Ready</span>}
          </div>
        );
      },
      
    },
    {
      accessorKey: "deliveryPersonnel",
      header: "Delivery Note",
      cell: ({ row }) => {
        const deliveryStaffName = row.original.deliveryNotes || assignedPerson;
        
        const isReady = row.original.status === "READY";
  
        return (
          <div className="flex items-center space-x-2">
            <span>{deliveryStaffName}</span>
            {isReady && deliveryStaffName === assignedPerson && (
              <AssignMealModal
                mealBoxId={row.original.id}
                deliveryPersonnelList={deliveryPersonnelList}
                onAssign={assignDeliveryPersonnel}
              />
            )}
          </div>
        );
      },
    },
  ];
 

  
  

  return (
    <div className="p-4">
      <h1 className="text-lg font-semibold mb-4">Meal Preparation</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <DataTable columns={columns} data={mealBoxes} />
      )}
    </div>
  );
}
