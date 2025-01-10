import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET() {
  try {
    const unassignedMealBoxes = await prisma.mealBox.findMany({
      where: {
        pantryStaffId: null,
        status: "PENDING",
      },
      include: {
        patient: {
          select: {
            name: true,
            roomNumber: true,
            bedNumber: true,
          },
        },
        dietChart: {
          select: {
            mealType: true,
            items: true,
            instructions: true,
          },
        },
      },
    });
    
    return NextResponse.json(unassignedMealBoxes);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Error fetching unassigned meal boxes `},
      { status: 500 }
    );
  }
}