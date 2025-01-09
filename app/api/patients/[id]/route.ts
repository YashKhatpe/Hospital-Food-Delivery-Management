import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Get a specific patient
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: params.id },
      include: {
        dietCharts: true,
        mealBoxes: true,
      },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json(patient);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching patient" },
      { status: 500 }
    );
  }
}

// Update a patient
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const json = await request.json();
    const patient = await prisma.patient.update({
      where: { id: params.id },
      data: json,
    });
    return NextResponse.json(patient);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating patient" },
      { status: 500 }
    );
  }
}

// Delete a patient
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.patient.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: "Patient deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting patient" },
      { status: 500 }
    );
  }
}
