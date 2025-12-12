"use server";

import { cookies } from "next/headers";

export async function createPost(postData: {
  title: string;
  body: string;
  category: string;
  tags: string[];
}) {
  // 쿠키에서 토큰 가져오기 (또는 요청 헤더에서)
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";

  if (!token) {
    return {
      success: false,
      error: "Missing Bearer token",
    };
  }

  try {
    const res = await fetch("http://fe-hiring-rest-api.vercel.app/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: data.message || "Failed to create post",
      };
    }

    return {
      success: true,
      data,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Server error",
    };
  }
}
