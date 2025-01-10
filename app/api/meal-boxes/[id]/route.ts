import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Get a specific meal box
export async function GET(
  request: NextRequest
) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    

    if (!id) {
      return NextResponse.json(
        { error: "Missing ID in the URL" },
        { status: 400 }
      );
    }

    const mealBoxes = await getMealBoxesByPantryStaff(id);
    return NextResponse.json(mealBoxes, { status: 200 });
  } catch (error) {
    console.error("Error fetching meal box:", error);
    return NextResponse.json(
      { error: "Error fetching meal box" },
      { status: 500 }
    );
  }
}

// Update a meal box
export async function PUT(
  request: NextRequest
) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    

    if (!id) {
      return NextResponse.json(
        { error: "Missing ID in the URL" },
        { status: 400 }
      );
    }

    const json = await request.json();

    const mealBox = await prisma.mealBox.update({
      where: { id },
      data: json,
      include: {
        patient: {
          select: {
            name: true,
            roomNumber: true,
            bedNumber: true,
          },
        },
        dietChart: true,
      },
    });

    return NextResponse.json(mealBox, { status: 200 });
  } catch (error) {
    console.error("Error updating meal box:", error);
    return NextResponse.json(
      { error: "Error updating meal box" },
      { status: 500 }
    );
  }
}

// Helper function: Get meal boxes by pantry staff ID
export async function getMealBoxesByPantryStaff(pantryStaffId: string) {
  try {
    const mealBoxes = await prisma.mealBox.findMany({
      where: {
        pantryStaffId,
        status: "PREPARING",
      },
    });

    return mealBoxes;
  } catch (error) {
    console.error("Error fetching meal boxes:", error);
    throw new Error("Failed to fetch meal boxes");
  }
}
