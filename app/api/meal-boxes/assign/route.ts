import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { mealBoxIds, pantryStaffId } = await request.json();

    // Update all selected meal boxes in a transaction
    const updates = await prisma.$transaction(
      mealBoxIds.map((id: string) =>
        prisma.mealBox.update({
          where: { id },
          data: {
            pantryStaffId,
            status: "PREPARING",
          },
        })
      )
    );

    return NextResponse.json(updates);
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error assigning meal boxes, ${error.message}` },
      { status: 500 }
    );
  }
}


export async function PATCH(request: Request) {
    try {
      const { mealBoxId, status } = await request.json();
  
      const updatedMealBox = await prisma.mealBox.update({
        where: { id: mealBoxId },
        data: { status },
      });
  
      return new Response(JSON.stringify({ success: true, updatedMealBox }), {
        status: 200,
      });
    } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }
  }
  