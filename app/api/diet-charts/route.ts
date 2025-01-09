import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Get all diet charts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patientId");

    const where = patientId ? { patientId } : {};
    
    const dietCharts = await prisma.dietChart.findMany({
      where,
      include: {
        patient: {
          select: {
            name: true,
            roomNumber: true,
            bedNumber: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    
    return NextResponse.json(dietCharts);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching diet charts" },
      { status: 500 }
    );
  }
}

// Create a new diet chart
export async function POST(request: Request) {
  try {
    const json = await request.json();
    const dietChart = await prisma.dietChart.create({
      data: json,
      include: {
        patient: {
          select: {
            name: true,
            roomNumber: true,
            bedNumber: true,
          },
        },
      },
    });
    return NextResponse.json(dietChart);
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating diet chart" },
      { status: 500 }
    );
  }
}