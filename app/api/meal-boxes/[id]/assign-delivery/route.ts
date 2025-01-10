import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { id, deliveryStaffId } = await req.json();

    // Validate input
    if (!id || !deliveryStaffId) {
      return NextResponse.json(
        { error: "Both 'id' and 'deliveryStaffId' are required." },
        { status: 400 }
      );
    }

    // Update the meal box in the database
    const updatedMealBox = await prisma.mealBox.update({
      where: { id },
      data: {
        deliveryStaffId: deliveryStaffId,
        status: "DELIVERING", // Change status to DELIVERING
      },
    });

    // Return the updated meal box
    return NextResponse.json(updatedMealBox, { status: 200 });
  } catch (error) {
    console.error("Error updating meal box:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
