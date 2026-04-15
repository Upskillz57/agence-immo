import fs from "fs";

let cache: any[] = [];
let lastLoad = 0;

export function parseHektorCSV() {
  const now = Date.now();

  // ⚡ CACHE (30 secondes)
  if (cache.length > 0 && now - lastLoad < 30000) {
    console.log("⚡ CACHE USED");
    return cache;
  }

  const filePath = "/home/hektorftp/export/data/Annonces.csv";

  console.log("📁 PATH:", filePath);
  console.log("📁 EXISTS:", fs.existsSync(filePath));

  if (!fs.existsSync(filePath)) {
    throw new Error("CSV file not found");
  }

  const file = fs.readFileSync(filePath, "latin1");

  console.log("📄 FILE SIZE:", file.length);

  const lines = file.split("\n").filter(Boolean);

  console.log("📊 NB LIGNES:", lines.length);

  const data = lines
    .map((line, index) => {
      try {
        const cols = line
          .split("!#")
          .map((c) => c.replace(/"/g, "").trim());

        if (cols.length < 5) return null;

        const get = (i: number) => cols[i] || "";

        const images = cols.filter(
          (c) =>
            c.includes("http") &&
            (c.endsWith(".jpg") ||
              c.endsWith(".png") ||
              c.endsWith(".jpeg"))
        );

        return {
          id: get(1) || index.toString(),
          title: get(19) || "Sans titre",
          type: get(3),
          city: get(5),
          price: Number(get(10)) || 0,
          surface: Number(get(15)) || 0,

          // ✅ FIX IMPORTANT
          rooms: Number(get(17)) || 0,
          bedrooms: Number(get(18)) || 0,

          description: (get(20) || "").replace(/<[^>]*>/g, ""),
          image: images[0] || "/placeholder.jpg",
          images,

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

  cache = data;
  lastLoad = now;

  console.log("✅ DATA LOADED & CACHED");

  return data;
}