import { mockProperties } from "@/data/mockProperties";
import { Property } from "@/types/property";

// 🔥 aujourd’hui : mock
// 🔥 demain : Supabase / Hektor

export async function getProperties(): Promise<Property[]> {
  return mockProperties;
}

export async function getPropertyById(id: string): Promise<Property | undefined> {
  const properties = await getProperties();
  return properties.find((p) => p.id === id);
}