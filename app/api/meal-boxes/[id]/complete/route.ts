// app/api/meal-boxes/[id]/complete/route.ts
import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";


export async function POST(
  req: NextRequest,
) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    const { deliveryNotes } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID parameter is required." }, { status: 400 });
    }
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
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error completing delivery" },
      { status: 500 }
    );
  }
}