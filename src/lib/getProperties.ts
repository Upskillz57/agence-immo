import { parseHektorCSV } from "./hektorParser";

// 🔥 LISTE DES BIENS
export async function getProperties() {
  return parseHektorCSV();
}

// 🔥 DETAIL D’UN BIEN
export async function getPropertyById(id: string) {
  const properties = parseHektorCSV();

  return properties.find(
    (p) => p.id?.toString().trim() === id.toString().trim()
  );
}