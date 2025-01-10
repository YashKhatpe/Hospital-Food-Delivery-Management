import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Get a specific patient
export async function GET(
  request: NextRequest
) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID parameter is required." }, { status: 400 });
    }
    const patient = await prisma.patient.findUnique({
      where: { id },
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
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching patient" },
      { status: 500 }
    );
  }
}

// Update a patient
export async function PUT(
  request: Request,
) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID parameter is required." }, { status: 400 });
    }
    const json = await request.json();
    const patient = await prisma.patient.update({
      where: { id },
      data: json,
    });
    return NextResponse.json(patient);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error updating patient" },
      { status: 500 }
    );
  }
}

// Delete a patient
export async function DELETE(
  request: Request,
) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID parameter is required." }, { status: 400 });
    }

    await prisma.patient.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error in deleteion" },
      { status: 500 }
    );
  }
}
