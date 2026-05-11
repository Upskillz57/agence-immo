// src/app/api/properties/route.ts

import { NextResponse } from "next/server";
import { parseHektorCSV } from "@/lib/hektorParser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    console.log("📡 API PROPERTIES CALLED");

    const data = await parseHektorCSV();

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("❌ ERREUR API:", error);

    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}