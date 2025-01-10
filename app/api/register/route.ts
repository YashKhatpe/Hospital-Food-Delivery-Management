import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, password, name, role, contactNumber } = await req.json();

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
        contactNumber,
      },
    });

    if(user.role == "DELIVERY_STAFF") {
     await prisma.deliveryStaff.create({
        data: {
          userId: user.id,
        }
      })
    } else if(user.role == "PANTRY_STAFF") {
      await prisma.pantryStaff.create({
        data: {
          userId: user.id,
          location: ""
        }
      })
    }

    return NextResponse.json({
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error in registeration" },
      { status: 500 }
    );
  }
}