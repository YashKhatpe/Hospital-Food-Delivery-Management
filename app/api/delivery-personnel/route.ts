// GET /api/delivery-personnel
import { prisma } from "@/lib/prisma";

export async function GET() {
  const deliveryPersonnel = await prisma.deliveryStaff.findMany({
    include: {
      user: true, // Include user details for name and email
    },
  });

  const formattedData = deliveryPersonnel.map((personnel) => ({
    id: personnel.id,
    name: personnel.user.name,
  }));

  return new Response(JSON.stringify(formattedData), { status: 200 });
}
