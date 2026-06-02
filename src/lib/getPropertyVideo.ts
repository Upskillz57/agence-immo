import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function getPropertyVideo(id: string): Promise<string | null> {
  try {
    const cmd = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: "videos.json",
    });
    const res = await s3.send(cmd);
    const body = await res.Body?.transformToString();
    const map = body ? JSON.parse(body) : {};
    return map[id] ?? null;
  } catch {
    return null;
  }
}