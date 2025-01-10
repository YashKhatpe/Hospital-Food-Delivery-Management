import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  context: { params: { id: string } } // Correctly typed context object
) {
  try {
    const { id } = context.params; // Correctly access `params.id`
    const { deliveryNotes } = await request.json();

    // Validate the presence of required fields
    if (!id || !deliveryNotes) {
      return NextResponse.json(
        { error: "Meal box ID and delivery notes are required." },
        { status: 400 }
      );
    }

    // Update the meal box with the status and delivery notes
    const updatedMealBox = await prisma.mealBox.update({
      where: {
        id,
      },
      data: {
        status: "DELIVERED",
        deliveryNotes,
      },
    });

    return NextResponse.json(updatedMealBox, { status: 200 });
  } catch (error) {
    console.error("Error completing delivery:", error);
    return NextResponse.json(
      { error: "Error completing delivery." },
      { status: 500 }
    );
  }
}
