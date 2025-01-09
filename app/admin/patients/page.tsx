"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Patient } from "@/types/types";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal state for adding a new patient
  const [newPatient, setNewPatient] = useState<Partial<Patient>>({
    name: "",
    age: 0,
    gender: "MALE",
    roomNumber: "",
    bedNumber: "",
    floorNumber: "",
    contactNumber: "",
    emergencyContact: "",
    diseases: [],
    allergies: [],
  });

  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch patients from API
  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/patients");
        if (response.ok) {
          const data = await response.json();
          setPatients(data);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch patients.",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Add a new patient
  const handleAddPatient = async () => {
    try {
      const response = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPatient),
      });

      if (response.ok) {
        const addedPatient = await response.json();
        setPatients((prev) => [...prev, addedPatient]);
        toast({
          title: "Success",
          description: "Patient added successfully.",
        });
        setDialogOpen(false);
        setNewPatient({
          name: "",
          age: 0,
          gender: "MALE",
          roomNumber: "",
          bedNumber: "",
          floorNumber: "",
          contactNumber: "",
          emergencyContact: "",
          diseases: [],
          allergies: [],
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "Failed to add patient.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Patients</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Patient</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Patient</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddPatient();
              }}
              className="space-y-4"
            >
              <Input
                placeholder="Name"
                value={newPatient.name}
                onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                required
              />
              <Input
                type="number"
                placeholder="Age"
                value={newPatient.age || ""}
                onChange={(e) => setNewPatient({ ...newPatient, age: parseInt(e.target.value) })}
                required
              />
              <Select
                onValueChange={(value) =>
                  setNewPatient({ ...newPatient, gender: value as Patient["gender"] })
                }
                value={newPatient.gender || "MALE"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Room Number"
                value={newPatient.roomNumber}
                onChange={(e) => setNewPatient({ ...newPatient, roomNumber: e.target.value })}
                required
              />
              <Input
                placeholder="Bed Number"
                value={newPatient.bedNumber}
                onChange={(e) => setNewPatient({ ...newPatient, bedNumber: e.target.value })}
                required
              />
              <Input
                placeholder="Floor Number"
                value={newPatient.floorNumber}
                onChange={(e) => setNewPatient({ ...newPatient, floorNumber: e.target.value })}
                required
              />
              <Input
                placeholder="Contact Number"
                value={newPatient.contactNumber}
                onChange={(e) => setNewPatient({ ...newPatient, contactNumber: e.target.value })}
                required
              />
              <Input
                placeholder="Emergency Contact"
                value={newPatient.emergencyContact}
                onChange={(e) => setNewPatient({ ...newPatient, emergencyContact: e.target.value })}
                required
              />
              <Button type="submit">Add Patient</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mt-6">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell>
                    {patient.roomNumber}, Floor {patient.floorNumber}
                  </TableCell>
                  <TableCell>{patient.contactNumber}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
