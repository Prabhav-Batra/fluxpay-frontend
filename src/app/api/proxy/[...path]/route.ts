import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleProxyRequest(request, params.path);
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleProxyRequest(request, params.path);
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleProxyRequest(request, params.path);
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleProxyRequest(request, params.path);
}

async function handleProxyRequest(request: NextRequest, pathArray: string[]) {
  const path = pathArray.join("/");
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
  const url = new URL(`${backendUrl}/${path}`);
  
  // Forward query params
  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.append(key, value);
  });

  const headers = new Headers();
  headers.set("Content-Type", request.headers.get("Content-Type") || "application/json");

  // Inject the token from the HttpOnly cookie
  const token = request.cookies.get("fluxpay_token")?.value;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let body = null;
  if (request.method !== "GET" && request.method !== "HEAD") {
    body = await request.text();
  }

  try {
    const response = await fetch(url.toString(), {
      method: request.method,
      headers,
      body,
    });

    const data = await response.text();
    return new NextResponse(data, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
