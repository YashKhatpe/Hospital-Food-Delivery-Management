import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


// Get a specific meal box
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if(!params.id) {
      return NextResponse.json({error: "Missing ID in the url"}, {status: 400});
    }

    const mealBoxes = await getMealBoxesByPantryStaff(params.id);
    return NextResponse.json(mealBoxes);
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error fetching meal box, ${error.message} ` },
      { status: 500 }
    );
  }
}

// Update a meal box
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const json = await request.json();
    const mealBox = await prisma.mealBox.update({
      where: { id: params.id },
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
    return NextResponse.json(mealBox);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating meal box" },
      { status: 500 }
    );
  }
}




export async function getMealBoxesByPantryStaff(pantryStaffId: string) {
  try {
    const mealBoxes = await prisma.mealBox.findMany({
      where: {
        pantryStaffId: pantryStaffId,
        status: "PREPARING",
      },
    });
    return mealBoxes;
  } catch (error) {
    console.error("Error fetching meal boxes:", error);
    throw new Error("Failed to fetch meal boxes");
  }
}