import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Call the Java backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
    const res = await fetch(`${backendUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    // Extract token from the response
    const token = data.data?.token;
    const merchantId = data.data?.merchantId;

    if (!token) {
      return NextResponse.json({ error: "No token received from backend" }, { status: 500 });
    }

    // Create the response object
    const response = NextResponse.json({ data: { merchantId } }, { status: 200 });

    // Set the token in an HttpOnly cookie
    response.cookies.set({
      name: "fluxpay_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Register route error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
