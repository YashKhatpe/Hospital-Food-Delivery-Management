// app/api/meal-boxes/generate/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    // Get all diet charts
    const dietCharts = await prisma.dietChart.findMany({
      where: {
        // You might want to add date filtering here
      },
      include: {
        patient: true,
      },
    });

    // Create meal boxes for each diet chart that doesn't already have one for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const mealBoxes = await prisma.$transaction(async (prisma) => {
      const createdBoxes = [];

      for (const dietChart of dietCharts) {
        // Check if meal box already exists for this diet chart today
        const existingMealBox = await prisma.mealBox.findFirst({
          where: {
            dietChartId: dietChart.id,
            createdAt: {
              gte: today,
            },
          },
        });

        // If no meal box exists for today, create one
        if (!existingMealBox) {
          const mealBox = await prisma.mealBox.create({
            data: {
              patientId: dietChart.patientId,
              dietChartId: dietChart.id,
              status: "PENDING",
            },
            include: {
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
          });
          createdBoxes.push(mealBox);
        }
      }

      return createdBoxes;
    });

    return NextResponse.json({
      message: `Created ${mealBoxes.length} new meal boxes`,
      mealBoxes,
    });
  } catch (error) {
    console.error("Error generating meal boxes:", error);
    return NextResponse.json(
      { error: "Error generating meal boxes" },
      { status: 500 }
    );
  }
}
