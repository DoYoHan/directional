import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // 모든 헤더 확인
  const allHeaders: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    allHeaders[key] = value;
  });
  
  console.log("📋 === INCOMING REQUEST ===");
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  console.log("All Headers:", JSON.stringify(allHeaders, null, 2));
  
  const auth = req.headers.get("authorization") || "";
  console.log("🔍 Authorization header value:", auth || "(empty)");

  if (!auth) {
    console.log("❌ NO AUTHORIZATION HEADER FOUND");
    return NextResponse.json(
      { 
        message: "Missing Bearer token (proxy)", 
        receivedHeaders: allHeaders,
        authValue: auth
      },
      { status: 401 }
    );
  }

  console.log("✅ Authorization header found, forwarding to backend...");
  const body = await req.text();
  console.log("📋 Request body:", body);

  const fetchHeaders = new Headers({
    "Content-Type": "application/json",
    Authorization: auth,
  });
  
  console.log("📤 Sending to backend with headers:", {
    "Content-Type": fetchHeaders.get("content-type"),
    "Authorization": fetchHeaders.get("authorization"),
  });

  try {
    const res = await fetch("http://fe-hiring-rest-api.vercel.app/posts", {
      method: "POST",
      headers: fetchHeaders,
      body,
    });

    const data = await res.json();
    
    console.log("🔄 Backend response status:", res.status);
    console.log("🔄 Backend response body:", JSON.stringify(data, null, 2));
    
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    console.error("❌ Error forwarding request:", err);
    return NextResponse.json(
      { message: "Proxy error", error: err.message },
      { status: 500 }
    );
  }
}
