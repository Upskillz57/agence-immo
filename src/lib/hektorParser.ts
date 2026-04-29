import fs from "fs";

let cache: any[] = [];
let lastLoad = 0;

// 🔥 cache géocodage
const geoCache: Record<string, { lat: number; lng: number }> = {};

function extractAmenities(description: string) {
  const text = description.toLowerCase();

  const amenities: string[] = [];

  if (text.includes("piscine")) amenities.push("Piscine");
  if (text.includes("terrasse")) amenities.push("Terrasse");
  if (text.includes("jardin")) amenities.push("Jardin");
  if (text.includes("garage")) amenities.push("Garage");
  if (text.includes("parking")) amenities.push("Parking");
  if (text.includes("clim")) amenities.push("Clim");
  if (text.includes("ascenseur")) amenities.push("Ascenseur");

  return amenities;
}

async function geocode(city: string, postal?: string) {
  if (!city) return { lat: 49.119, lng: 6.176 };

  const key = `${city}-${postal || ""}`;
  if (geoCache[key]) return geoCache[key];

  try {
    // 🔥 IMPORTANT : on force FRANCE
    const query = `${city} ${postal || ""} France`;

    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&country=fr&limit=1`
    );

    const data = await res.json();

    const coords = data?.features?.[0]?.center;

    if (coords) {
      const result = {
        lng: coords[0],
        lat: coords[1],
      };

      geoCache[key] = result;
      return result;
    }
  } catch (e) {
    console.log("❌ GEO ERROR:", city);
  }

  // fallback Metz
  return { lat: 49.119, lng: 6.176 };
}

export async function parseHektorCSV() {
  const now = Date.now();

  // ⚡ CACHE GLOBAL (30s)
  if (cache.length > 0 && now - lastLoad < 30000) {
    console.log("⚡ CACHE USED");
    return cache;
  }

  const filePath = "/home/hektorftp/export/data/Annonces.csv";

  if (!fs.existsSync(filePath)) {
    throw new Error("CSV file not found");
  }

  const file = fs.readFileSync(filePath, "latin1");
  const lines = file.split("\n").filter(Boolean);

  console.log("📊 NB LIGNES:", lines.length);

  const data: any[] = [];

  for (let i = 0; i < lines.length; i++) {
    try {
      const cols = lines[i]
        .split("!#")
        .map((c) => c.replace(/"/g, "").trim());

        if (i < 5) {
          console.log("LIGNE:", i);
          console.log(cols);
        }
  
      if (cols.length < 5) continue;
  
      const get = (i: number) => cols[i] || "";
  
      const images = cols.filter(
        (c) =>
          c.includes("http") &&
          (c.endsWith(".jpg") ||
            c.endsWith(".png") ||
            c.endsWith(".jpeg"))
      );
  
      const city = get(5);
      const postal = get(6);
  
      // ✅ TRANSACTION (ICI 👇)
      const rawTransaction = get(2); // à vérifier
      const transaction =
        rawTransaction?.toLowerCase().includes("loc")
          ? "location"
          : "vente";
  
      const geo = await geocode(city, postal);
  
      const description = (get(20) || "").replace(/<[^>]*>/g, "");
  
      data.push({
        id: get(1) || i.toString(),
        title: get(19) || "Sans titre",
        type: get(3),
        transaction, // ✅ propre ici
        city,
        price: Number(get(10)) || 0,
        surface: Number(get(15)) || 0,
        rooms: Number(get(17)) || 0,
        bedrooms: Number(get(18)) || 0,
        bathrooms: Number(get(16)) || 0,
        description,
        image: images[0] || "/placeholder.jpg",
        images,
        lat: geo.lat,
        lng: geo.lng,
        amenities: extractAmenities(description),
      });
  
    } catch (err) {
      console.log("❌ Erreur ligne:", i, err);
    }
  }

  cache = data;
  lastLoad = now;

  console.log("✅ DATA LOADED & CACHED");

  return data;
}