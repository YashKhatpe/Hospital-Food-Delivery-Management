import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const personnel = await prisma.deliveryStaff.findUnique({
      where: { id },
      include: {
        user: true, // Include user details for name and email
      },
    });

    if (!personnel) {
      return new Response(
        JSON.stringify({ error: "Delivery personnel not found." }),
        { status: 404 }
      );
    }

    const formattedData = {
      id: personnel.id,
      name: personnel.user.name,
    };

    return new Response(JSON.stringify(formattedData), { status: 200 });
  } catch (error) {
    console.error("Error fetching delivery personnel:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error." }),
      { status: 500 }
    );
  }
}
