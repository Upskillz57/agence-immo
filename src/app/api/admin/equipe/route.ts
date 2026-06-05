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

const DEFAULT_ADVISORS = [
  { id: "fabien", name: "Fabien Marchal", role: "Directeur", phone: "06 33 06 75 23", email: "f.marchal@marchal.immo", image: "/fabien.jpg" },
  { id: "elodie", name: "Elodie Marchal", role: "Agent commercial", phone: "07 82 37 37 88", email: "e.marchal@marchal.immo", image: "/elo.jpg" },
  { id: "aziza", name: "Aziza Marchal", role: "Agent commercial", phone: "06 19 08 84 25", email: "a.marchal@marchal.immo", image: "/aziza.jpg" },
  { id: "benoit", name: "Benoit Callizot", role: "Agent commercial", phone: "06 85 01 03 05", email: "b.callizot@marchal.immo", image: "/BenoitCallizot.jpg" },
  { id: "laurent", name: "Laurent Krempt", role: "Agent commercial", phone: "07 66 57 45 12", email: "l.krempt@marchal.immo", image: "/LaurentKrempt.jpg" },
  { id: "jeanpaul", name: "Jean-Paul Schlecht", role: "Agent commercial", phone: "06 75 97 60 37", email: "jp.schlecht@marchal.immo", image: "/JeanPaulSchlecht.jpg" },
  { id: "jerome", name: "Jérôme Bon", role: "Agent commercial", phone: "06 85 88 86 11", email: "j.bon@marchal.immo", image: "/JeromeBon.jpg" },
  { id: "axel", name: "Axel Szwec", role: "Agent commercial", phone: "06 22 49 07 57", email: "a.szwec@marchal.immo", image: "/AxelSzwec.jpg" },
];

async function getAdvisors() {
  try {
    const res = await s3.send(new GetObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: "equipe.json" }));
    const body = await res.Body?.transformToString();
    return body ? JSON.parse(body) : DEFAULT_ADVISORS;
  } catch {
    return DEFAULT_ADVISORS;
  }
}

async function saveAdvisors(advisors: any[]) {
  await s3.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: "equipe.json",
    Body: JSON.stringify(advisors),
    ContentType: "application/json",
  }));
}

export async function GET() {
  return NextResponse.json(await getAdvisors());
}

// Modifier un conseiller
export async function PUT(req: Request) {
  const updated = await req.json();
  const advisors = await getAdvisors();
  const next = advisors.map((a: any) => a.id === updated.id ? { ...a, ...updated } : a);
  await saveAdvisors(next);
  return NextResponse.json({ ok: true });
}

// Ajouter un conseiller
export async function POST(req: Request) {
  const newAdvisor = await req.json();
  const advisors = await getAdvisors();
  await saveAdvisors([...advisors, newAdvisor]);
  return NextResponse.json({ ok: true });
}

// Supprimer un conseiller
export async function DELETE(req: Request) {
  const { id } = await req.json();
  const advisors = await getAdvisors();
  await saveAdvisors(advisors.filter((a: any) => a.id !== id));
  return NextResponse.json({ ok: true });
}