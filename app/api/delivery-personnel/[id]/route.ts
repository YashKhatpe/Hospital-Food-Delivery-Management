import { prisma } from "@/lib/prisma";

export async function GET({ params }: { params: { id: string } }) {
  const { id } = params;

  // Check if ID is provided
  if (!id) {
    return new Response(
      JSON.stringify({ error: "ID parameter is required." }),
      { status: 400 }
    );
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
      return new Response(
        JSON.stringify({ error: "Delivery personnel not found." }),
        { status: 404 }
      );
    }

    // Format the response data
    const formattedData = {
      id: personnel.id,
      name: personnel.user.name,
    };

    // Return the formatted data with status 200
    return new Response(JSON.stringify(formattedData), { status: 200 });
  } catch (error) {
    console.error("Error fetching delivery personnel:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error." }),
      { status: 500 }
    );
  }
}
