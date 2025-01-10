// app/api/delivery-staff/deliveries/route.ts
import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";



export async function GET(res: NextResponse, { params }: { params: { id: string } }) {
  try {
    const id = params;
    
    if (id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the delivery staff id from the user id
    const deliveryStaff = await prisma.deliveryStaff.findFirst({
      where: {
        userId: id,
      },
    });

    if (!deliveryStaff) {
      return NextResponse.json({ error: "Delivery staff not found" }, { status: 404 });
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
    console.error(error);
    return NextResponse.json(
      { error: `Error fetching deliveries `},
      { status: 500 }
    );
  }
}
