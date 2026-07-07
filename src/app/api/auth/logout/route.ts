import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true }, { status: 200 });
  
  // Clear the cookie
  response.cookies.set({
    name: "fluxpay_token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0), // expire immediately
    path: "/",
  });

  return response;
}
