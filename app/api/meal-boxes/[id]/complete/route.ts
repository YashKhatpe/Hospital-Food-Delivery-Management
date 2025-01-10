// app/api/meal-boxes/[id]/complete/route.ts
import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    const { deliveryNotes } = await request.json();

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