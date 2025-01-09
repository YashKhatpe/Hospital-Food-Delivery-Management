
// // app/api/meal-boxes/[id]/complete/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { deliveryNotes } = await request.json();
    const { id } = params;

    const updatedMealBox = await prisma.mealBox.update({
      where: {
        id,
      },
      data: {
        status: "DELIVERED",
        deliveryNotes,
      },
    });

    return NextResponse.json(updatedMealBox);
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error completing delivery, ${error.message}`  },
      { status: 500 }
    );
  }
}