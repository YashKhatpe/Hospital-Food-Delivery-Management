import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Get all patients
export async function GET() {
  try {
    
    const preparingCount = await prisma.mealBox.count({
        where: {
            status: "PREPARING"
        }
    });
    const deliveringCount = await prisma.mealBox.count({
        where: {
            status: "DELIVERING"
        }
    });
    const pendingCount = await prisma.mealBox.count({
        where: {
            status: "PENDING"
        }
    });
    return NextResponse.json({preparingCount, deliveringCount, pendingCount});
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Errror in counting patients and mealBoxes" },
      { status: 500 }
    );
  }
}