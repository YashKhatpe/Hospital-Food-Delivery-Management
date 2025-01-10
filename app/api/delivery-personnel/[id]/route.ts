import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  // Extract the 'id' parameter from the URL
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  // Check if ID is provided
  if (!id) {
    return NextResponse.json({ error: "ID parameter is required." }, { status: 400 });
  }

  try {
    // Query the delivery personnel from the database
    const personnel = await prisma.deliveryStaff.findUnique({
      where: { id },
      include: {
        user: true, // Include user details for name and email
      },
    });

    // If no personnel found, return 404
    if (!personnel) {
      return NextResponse.json({ error: "Delivery personnel not found." }, { status: 404 });
    }

    // Format the response data
    const formattedData = {
      id: personnel.id,
      name: personnel.user.name,
    };

    // Return the formatted data with status 200
    return NextResponse.json(formattedData, { status: 200 });
  } catch (error) {
    console.error("Error fetching delivery personnel:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
