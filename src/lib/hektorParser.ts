import fs from "fs";

export function parseHektorCSV() {
  const filePath = process.cwd() + "/test.csv";

  console.log("📁 PATH:", filePath);
  console.log("📁 EXISTS:", fs.existsSync(filePath));

  if (!fs.existsSync(filePath)) {
    throw new Error("CSV file not found");
  }

  const file = fs.readFileSync(filePath, "latin1");

  console.log("📄 FILE SIZE:", file.length);

  const lines = file.split("\n").filter(Boolean);

  console.log("📊 NB LIGNES:", lines.length);

  return lines
    .map((line, index) => {
      try {
        const cols = line
          .split("!#")
          .map((c) => c.replace(/"/g, "").trim());

        // ⚠️ ignore lignes trop courtes
        if (cols.length < 5) {
          console.log("⚠️ Ligne ignorée:", cols);
          return null;
        }

        const get = (i: number) => cols[i] || "";
        const images = cols.filter((c) => c.includes("http"));

        return {
          id: get(1) || index.toString(),
          title: get(19) || "Sans titre",
          type: get(3),
          city: get(5),
          price: Number(get(10)) || 0,
          surface: Number(get(15)) || 0,
          bedrooms: Number(get(17)) || 0,
          rooms: Number(get(18)) || 0,
          description: (get(20) || "").replace(/<[^>]*>/g, ""),
          image: images[0] || "/placeholder.jpg",
          images: images,
          lat: 49.119,
          lng: 6.176,
          amenities: [],
        };
      } catch (err) {
        console.log("❌ Erreur ligne:", index, err);
        return null;
      }
    })
    .filter(Boolean);
}