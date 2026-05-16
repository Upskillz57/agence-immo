let cache: any[] = [];
let lastLoad = 0;

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

/**
 * Détecte le statut du bien à partir du titre ET de la description.
 *
 * ⚠️  Règles strictes pour éviter les faux positifs :
 *  - "vendu"              → VENDU        (ex: "VENDU LOUÉ", "maison vendue")
 *  - "sous compromis"     → SOUS COMPROMIS  (PAS "compromis" seul — ex: "sans compromis")
 *  - "sous offre"         → SOUS OFFRE
 *  - "vente interactive"  → SOUS OFFRE   (système d'enchères Hektor/Squarimo)
 *
 * Priorité : VENDU > SOUS COMPROMIS > SOUS OFFRE
 */
function detectStatus(title: string, description: string): string {
  const text = (title + " " + description).toLowerCase();

  if (text.includes("vendu")) return "VENDU";
  if (text.includes("sous compromis")) return "SOUS COMPROMIS";
  if (text.includes("sous offre") || text.includes("vente interactive")) return "SOUS OFFRE";

  return "";
}

function extractAgent(description: string): string {
  const patterns = [
    /([A-ZÀ-Ü][a-zà-ü]+)\s+[A-Z]{2,}\s+(?:vous propose|de l'agence)/,
    /([A-ZÀ-Ü][a-zà-ü]+)\s+(?:BON|SCHLECHT|KREMPT|CALLIZOT)\b/,
  ];
  
  for (const pattern of patterns) {
    const match = description.match(pattern);
    if (match) return match[1];
  }
  return "";
}

async function geocode(city: string, postal?: string) {
  if (!city) return { lat: 49.119, lng: 6.176 };

  const key = `${city}-${postal || ""}`;
  if (geoCache[key]) return geoCache[key];

  try {
    const query = postal?.startsWith("57")
      ? `${city} ${postal} Moselle France`
      : `${city} ${postal || ""} France`;

    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        query
      )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&country=fr&limit=1`
    );

    const data = await res.json();
    const coords = data?.features?.[0]?.center;

    if (coords) {
      const lng = coords[0];
      const lat = coords[1];

      const inZone =
        lat > 48.5 && lat < 49.7 &&
        lng > 5.5 && lng < 7.5;

      if (!inZone) {
        console.log("❌ COORDS HORS ZONE:", city, lat, lng);
        return { lat: 49.119, lng: 6.176 };
      }

      const result = { lng, lat };
      geoCache[key] = result;
      return result;
    }
  } catch (e) {
    console.log("❌ GEO ERROR:", city);
  }

  return { lat: 49.119, lng: 6.176 };
}

export async function parseHektorCSV() {
  const now = Date.now();

  if (cache.length > 0 && now - lastLoad < 600000) {
    console.log("⚡ CACHE USED");
    return cache;
  }

  const csvUrl = "http://91.134.141.44/hektor/Annonces.csv";

  const res = await fetch(csvUrl, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`CSV file not found: ${res.status}`);
  }

  const buffer = await res.arrayBuffer();
  const file = Buffer.from(buffer).toString("latin1");

  const lines = file.split("\n").filter(Boolean);
  console.log("📊 NB LIGNES:", lines.length);

  const data: any[] = [];

  for (let i = 0; i < lines.length; i++) {
    try {
      const cols = lines[i]
        .split("!#")
        .map((c) => c.replace(/"/g, "").trim());

      if (cols.length < 5) continue;

      const get = (idx: number) => cols[idx] || "";

      const images = cols.filter(
        (c) =>
          c.includes("http") &&
          (c.endsWith(".jpg") || c.endsWith(".png") || c.endsWith(".jpeg"))
      );

      const postal         = get(4);
      const city           = get(5);
      const rawTransaction = get(2);
      const rawType        = get(3); // "maison", "appartement", "terrain", "local"

      // ── SEUL CHANGEMENT : "local*" → professionnels ───────────────────────
      const transaction = rawType?.toLowerCase().trim().startsWith("local")
        ? "professionnels"
        : rawTransaction?.toLowerCase().includes("loc")
        ? "location"
        : "vente";

      const geo = await geocode(city, postal);

      const description = (get(20) || "").replace(/<[^>]*>/g, "");
      const title = get(19) || "Sans titre";

      const status = ""; // inchangé — vos badges sont gérés séparément

      data.push({
        id: get(1) || i.toString(),
        title,
        type: rawType,
        transaction,

        city,
        postalCode: postal,

        status,

        price: Number(get(10)) || 0,

        surface: Number(get(15)) || 0,
        terrain: Number(get(16)) || 0,
        rooms:   Number(get(17)) || 0,
        bedrooms: Number(get(18)) || 0,
        bathrooms: 0,

        description,

        image: images[0] || "/placeholder.jpg",
        images,
        imageCount: images.length,

        lat: geo.lat,
        lng: geo.lng,

        amenities: extractAmenities(description),
        agent: extractAgent(description),
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