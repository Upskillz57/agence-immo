import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

async function getVideoMap(): Promise<Record<string, string>> {
  try {
    const cmd = new GetObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: "videos.json" });
    const res = await s3.send(cmd);
    const body = await res.Body?.transformToString();
    return body ? JSON.parse(body) : {};
  } catch {
    return {};
  }
}

async function saveVideoMap(map: Record<string, string>) {
  const cmd = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: "videos.json",
    Body: JSON.stringify(map),
    ContentType: "application/json",
  });
  await s3.send(cmd);
}

export async function GET() {
  const map = await getVideoMap();
  return NextResponse.json(map);
}

export async function POST(req: Request) {
  const { propertyId, videoUrl } = await req.json();
  const map = await getVideoMap();
  map[propertyId] = videoUrl;
  await saveVideoMap(map);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { propertyId } = await req.json();
  const map = await getVideoMap();
  
  // Supprimer le fichier vidéo de R2
  const url = map[propertyId];
  if (url) {
    const filename = url.split("/").pop();
    await s3.send(new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: filename }));
  }
  
  delete map[propertyId];
  await saveVideoMap(map);
  return NextResponse.json({ ok: true });
}