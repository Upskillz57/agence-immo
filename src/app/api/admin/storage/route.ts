import { NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function GET() {
  try {
    const cmd = new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME,
    });
    const res = await s3.send(cmd);
    const totalBytes = res.Contents?.reduce((acc, obj) => acc + (obj.Size || 0), 0) ?? 0;
    return NextResponse.json({ totalBytes });
  } catch {
    return NextResponse.json({ totalBytes: 0 });
  }
}