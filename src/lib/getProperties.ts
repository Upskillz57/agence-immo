import { parseHektorCSV } from "./hektorParser";

// 🔥 LISTE DES BIENS
export async function getProperties() {
  return parseHektorCSV();
}

// 🔥 DETAIL D’UN BIEN
export async function getPropertyById(id: string) {
  const properties = parseHektorCSV();

  if (!id) return undefined;

return properties.find(
  (p) =>
    p?.id &&
    p.id.toString().trim() === id.toString().trim()
);
}