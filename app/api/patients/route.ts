import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Get all patients
export async function GET() {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(patients);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Errror in Patients" },
      { status: 500 }
    );
  }
}

// Create a new patient
export async function POST(request: Request) {
  try {
    const json = await request.json();
    const patient = await prisma.patient.create({
      data: json,
    });
    return NextResponse.json(patient);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error creating patient" },
      { status: 500 }
    );
  }
}