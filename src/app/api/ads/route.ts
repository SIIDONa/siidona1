import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { ads } from "@/db/schema";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const location = formData.get("location") as string;
    const contactPhone = formData.get("contactPhone") as string;
    const contactEmail = formData.get("contactEmail") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const categoryId = parseInt(formData.get("categoryId") as string);

    if (!title || !description || !price || !categoryId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const [newAd] = await db.insert(ads).values({
      title,
      description,
      price,
      location: location || null,
      contactPhone: contactPhone || null,
      contactEmail: contactEmail || null,
      imageUrl: imageUrl || null,
      categoryId,
      userId: session.id,
      status: "pending",
    }).returning();

    return NextResponse.json({ 
      success: true, 
      ad: newAd 
    });
  } catch (error) {
    console.error("Error creating ad:", error);
    return NextResponse.json(
      { error: "Failed to create ad" },
      { status: 500 }
    );
  }
}
