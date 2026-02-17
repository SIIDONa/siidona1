import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { language } = await request.json();
    
    // Validate language
    if (!["en", "am", "ar"].includes(language)) {
      return NextResponse.json({ error: "Invalid language" }, { status: 400 });
    }
    
    // Set cookie with language preference (1 year expiry)
    const response = NextResponse.json({ success: true });
    response.cookies.set("language", language, {
      httpOnly: false, // Allow client-side access for debugging
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    });
    
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Failed to set language" }, { status: 500 });
  }
}

export async function GET() {
  // This endpoint can be used to get current language from cookie
  // For now, we just return success
  return NextResponse.json({ success: true });
}
