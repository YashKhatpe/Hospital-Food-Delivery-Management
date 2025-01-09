// app/api/pantry-staff/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function GET() {
  try {
    const pantryStaff = await prisma.pantryStaff.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            contactNumber: true,
          },
        },
        mealBoxes: {
          select: {
            id: true,
            status: true,
            createdAt: true,
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
        },
      },
    });
    return NextResponse.json(pantryStaff);
  } catch (error: any) {
    return NextResponse.json(
      
      { error: `Error fetching pantry staff, ${error.message} `},
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, contactNumber, location } = body;

    // Hash the password
    const hashedPassword = await hash(password, 12);

    // Create user and pantry staff in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create user first
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          contactNumber,
          role: "PANTRY_STAFF",
        },
      });

      // Create pantry staff profile
      const pantryStaff = await prisma.pantryStaff.create({
        data: {
          userId: user.id,
          location,
        },
        include: {
          user: true,
        },
      });

      return pantryStaff;
    });

    return NextResponse.json(result);
  } catch (error:any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}