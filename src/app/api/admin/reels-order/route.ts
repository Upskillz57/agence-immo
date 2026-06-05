// /api/admin/reels-order/route.ts

import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

async function getOrder(): Promise<string[]> {
  try {
    const cmd = new GetObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: "reels-order.json" });
    const res = await s3.send(cmd);
    const body = await res.Body?.transformToString();
    return body ? JSON.parse(body) : [];
  } catch {
    return [];
  }
}

async function saveOrder(order: string[]) {
  await s3.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: "reels-order.json",
    Body: JSON.stringify(order),
    ContentType: "application/json",
  }));
}

export async function GET() {
  const order = await getOrder();
  return NextResponse.json({ order });
}

export async function POST(req: Request) {
  const { order } = await req.json();
  await saveOrder(order);
  return NextResponse.json({ ok: true });
}