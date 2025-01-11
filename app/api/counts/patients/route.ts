import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Get all patients
export async function GET() {
  try {
    const patientCount = await prisma.patient.count();
    return NextResponse.json({patientCount});
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Errror in counting patients and mealBoxes" },
      { status: 500 }
    );
  }
}