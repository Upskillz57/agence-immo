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

  const geoCache: Record<string, { lat: number; lng: number }> = {};

  function geocodeCitySync(city: string) {
    // ⚡ cache
    if (geoCache[city]) return geoCache[city];
  
    // fallback Metz (sécurité)
    const base = city.charCodeAt(0) || 1;

const fallback = {
  lat: 49.119 + (base % 10) * 0.01,
  lng: 6.176 + (base % 10) * 0.01,
};
  
    try {
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  
      // ⚠️ sync impossible → on fake avec fallback
      // on va améliorer après si besoin
  
      console.log("📍 GEO FALLBACK:", city);
  
      geoCache[city] = fallback;
      return fallback;
  
    } catch {
      return fallback;
    }
  }

  const cityCoords: Record<string, { lat: number; lng: number }> = {
    Metz: { lat: 49.1193, lng: 6.1757 },
    Thionville: { lat: 49.3576, lng: 6.1686 },
    Yutz: { lat: 49.3557, lng: 6.192 },
    Fameck: { lat: 49.298, lng: 6.109 },
    Marly: { lat: 49.063, lng: 6.154 },
    Montigny-lès-Metz: { lat: 49.095, lng: 6.153 },
    Ars-sur-Moselle: { lat: 49.078, lng: 6.074 },
    Rémilly: { lat: 49.016, lng: 6.395 },
    // ajoute au fur et à mesure
  };

  const lines = file.split("\n").filter(Boolean);

  console.log("📊 NB LIGNES:", lines.length);

  const data = lines
    .map((line, index) => {
      try {
        const cols = line
  .split("!#")
  .map((c) => c.replace(/"/g, "").trim());

// 🔥 DEBUG : afficher UNE seule ligne
if (index === 0) {
  console.log("COLS:", cols);
}

        if (cols.length < 5) return null;

        const get = (i: number) => cols[i] || "";

        const images = cols.filter(
          (c) =>
            c.includes("http") &&
            (c.endsWith(".jpg") ||
              c.endsWith(".png") ||
              c.endsWith(".jpeg"))
        );

        const city = get(5).trim();
const coords = cityCoords[city] || geocodeCitySync(city);

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

          lat: coords.lat,
lng: coords.lng,
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