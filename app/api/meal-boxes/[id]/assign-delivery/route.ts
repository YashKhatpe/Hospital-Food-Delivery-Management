import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params; // Access the :id parameter
  const { deliveryStaffId } = await req.json(); // Parse JSON body

  const updatedMealBox = await prisma.mealBox.update({
    where: { id },
    data: {
      deliveryStaffId: deliveryStaffId,
      status: "DELIVERING", // Change status to DELIVERING
    },
  });

  return NextResponse.json(updatedMealBox);
}
    