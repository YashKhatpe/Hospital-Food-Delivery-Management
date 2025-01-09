import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Get all diet charts
export async function GET() {
    try {
      const mealBoxes = await prisma.mealBox.findMany({
        include: {
          patient: true,
          dietChart: true,
          pantryStaff: true,
          deliveryStaff: true,
        },
      });
      return NextResponse.json(mealBoxes, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch meal boxes.' }, { status: 500 });
    }
  }

// Create a new diet chart
export async function POST(req: Request) {
    try {
      const body = await req.json();
       
      const mealBox = await prisma.mealBox.create({
        data: body,
      });
  
      return NextResponse.json(mealBox, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to create meal box.' }, { status: 500 });
    }
  }


// PUT: Update a meal box by ID
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
      const body = await req.json();
      const mealBox = await prisma.mealBox.update({
        where: { id: params.id },
        data: body,
      });
  
      return NextResponse.json(mealBox, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to update meal box.' }, { status: 500 });
    }
  }

  // DELETE 
  export async function DELETE(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');
  
      if (!id) {
        return NextResponse.json({ error: 'Meal box ID is required.' }, { status: 400 });
      }
  
      await prisma.mealBox.delete({
        where: { id },
      });
  
      return NextResponse.json({ message: 'Meal box deleted successfully.' }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to delete meal box.' }, { status: 500 });
    }
  }
  