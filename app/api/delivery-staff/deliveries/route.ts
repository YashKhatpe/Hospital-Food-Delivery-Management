import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // Extract the user ID from the query parameters
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID parameter is required." }, { status: 400 });
    }

    // Get the delivery staff record from the database
    const deliveryStaff = await prisma.deliveryStaff.findFirst({
      where: {
        userId: id,
      },
    });

    if (!deliveryStaff) {
      return NextResponse.json({ error: "Delivery staff not found." }, { status: 404 });
    }

    // Get all meal boxes assigned to this delivery staff
    const deliveries = await prisma.mealBox.findMany({
      where: {
        deliveryStaffId: deliveryStaff.id,
        status: {
          in: ["DELIVERING", "DELIVERED"],
        },
      },
      include: {
        patient: {
          select: {
            name: true,
            roomNumber: true,
            bedNumber: true,
            floorNumber: true,
            contactNumber: true,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(deliveries);
  } catch (error) {
    console.error("Error fetching deliveries:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
