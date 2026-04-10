import { NextResponse } from "next/server";
import { parseHektorCSV } from "@/lib/hektorParser";

export async function GET() {
  try {
    const data = parseHektorCSV();

    return NextResponse.json(data);
  } catch (error) {
    console.error("API ERROR:", error);

    return NextResponse.json(
      { error: "Erreur parsing CSV" },
      { status: 500 }
    );
  }
}