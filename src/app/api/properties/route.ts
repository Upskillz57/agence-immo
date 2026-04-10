import { NextResponse } from "next/server";
import { parseHektorCSV } from "@/lib/hektorParser";

// 🔥 IMPORTANT : désactive totalement le cache Next
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    console.log("📡 API PROPERTIES CALLED");

    const data = parseHektorCSV();

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ API ERROR:", error);

    return NextResponse.json(
      { error: "Erreur parsing CSV" },
      { status: 500 }
    );
  }
}