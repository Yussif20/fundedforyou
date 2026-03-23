import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

async function proxyRequest(req: NextRequest, path: string) {
  const search = req.nextUrl.search;
  const url = `${BACKEND_URL}/api/v1/${path}${search}`;

  // Get request body for non-GET requests
  // Use arrayBuffer to preserve binary data (important for FormData/multipart)
  let body: ArrayBuffer | undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    try {
      body = await req.arrayBuffer();
    } catch {
      body = undefined;
    }
  }

  // Forward headers (exclude host and other hop-by-hop headers)
  const headers = new Headers();
  req.headers.forEach((value, key) => {
    const excludedHeaders = [
      "host",
      "connection",
      "keep-alive",
      "transfer-encoding",
      "te",
      "trailer",
      "upgrade",
      "content-length",
    ];
    if (!excludedHeaders.includes(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  try {
    // Log auth header presence for debugging (redact actual token)
    const hasAuth = headers.has("authorization");
    console.log(`[Proxy] ${req.method} ${path} - Auth: ${hasAuth ? "present" : "missing"}`);

    const response = await fetch(url, {
      method: req.method,
      headers,
      body: body && body.byteLength > 0 ? body : undefined,
      // @ts-expect-error - duplex is required for streaming but not in types
      duplex: "half",
    });

    // Log response status for debugging
    if (response.status >= 400) {
      console.log(`[Proxy] ${req.method} ${path} - Response: ${response.status}`);
    }

    // Create response with backend's response
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      // Forward all headers except hop-by-hop
      const excludedHeaders = [
        "connection",
        "keep-alive",
        "transfer-encoding",
        "te",
        "trailer",
        "upgrade",
      ];
      if (!excludedHeaders.includes(key.toLowerCase())) {
        responseHeaders.set(key, value);
      }
    });

    // Handle cookies from backend
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      responseHeaders.set("set-cookie", setCookie);
    }

    const responseBody = await response.arrayBuffer();

    return new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("[Proxy] Error:", error);
    return NextResponse.json(
      { error: "Failed to connect to backend server" },
      { status: 502 },
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxyRequest(req, path.join("/"));
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxyRequest(req, path.join("/"));
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxyRequest(req, path.join("/"));
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxyRequest(req, path.join("/"));
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxyRequest(req, path.join("/"));
}
