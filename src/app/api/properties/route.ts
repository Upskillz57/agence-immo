import { NextResponse } from "next/server";
import { parseHektorCSV } from "@/lib/hektorParser";

export async function GET() {
  try {
    console.log("📡 API PROPERTIES CALLED");

    const data = parseHektorCSV();

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("❌ ERREUR API:", error);

    return NextResponse.json(
      {
        error: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}