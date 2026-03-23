import { NextResponse } from "next/server";

export async function GET(_req: Request) {
  try {
    // Call the IP API server-side
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    return NextResponse.json({ country: data.country_name });
  } catch (err) {
    return NextResponse.json({ country: null });
  }
}
