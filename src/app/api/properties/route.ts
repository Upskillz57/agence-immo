import fs from "fs";
import path from "path";

export function parseHektorCSV() {
  const filePath = path.join(process.cwd(), "data/Annonces.csv");

  // 🔥 Lire fichier
  const file = fs.readFileSync(filePath, "latin1");

  // 🔥 Split lignes
  const lines = file.split("\n").filter(Boolean);

  console.log("NB LIGNES:", lines.length);

  const properties = lines.map((line, index) => {
    try {
      const cols = line.split('"!#"');

      return {
        id: cols[1],
        transaction: cols[2],
        type: cols[3],
        postalCode: cols[4],
        city: cols[5],
        price: Number(cols[10]) || 0,
        surface: Number(cols[16]) || 0,
        land: Number(cols[17]) || 0,
        rooms: Number(cols[18]) || 0,
        bedrooms: Number(cols[19]) || 0,
        title: cols[20],
        description: cols[21],

        // 🔥 IMAGE PRINCIPALE
        image:
          cols.find((c) => c.includes("http")) || "/placeholder.jpg",
      };
    } catch (err) {
      console.log("❌ ERREUR LIGNE:", index);
      return null;
    }
  });

  // 🔥 Nettoyage
  return properties.filter(Boolean);
}