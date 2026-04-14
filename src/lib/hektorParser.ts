import fs from "fs";

export function parseHektorCSV() {
  const filePath =
    process.env.NODE_ENV === "production"
      ? "/home/hektorftp/export/data/Annonces.csv" // ✅ FIX
      : "data/Annonces.csv";

  if (!fs.existsSync(filePath)) {
    throw new Error("CSV file not found");
  }

  const file = fs.readFileSync(filePath, "latin1");

  const records = file.split('"nemestia"!#').filter(Boolean);

  return lines.map((line, index) => {
    const cols = line.split("!#").map((c) => c.replace(/"/g, "").trim());

    const get = (i: number) => cols[i] || "";

    // 🔥 IMAGES PROPRES (uniquement photos)
    const images = cols.filter(
      (c) => c.includes("http") && c.includes("photo")
    );

    return {
      id: get(1) || index.toString(),

      // ✅ TITRE COURT
      title: get(19) || "Bien immobilier",

      // ✅ TYPE
      type: get(3) || "",

      // ✅ LOCALISATION
      city: get(5) || "",

      // ✅ PRIX
      price: Number(get(10)) || 0,

      // ✅ SURFACE HABITABLE
      surface: Number(get(15)) || 0,

      // ✅ PIÈCES
      rooms: Number(get(17)) || 0,

      // ✅ CHAMBRES
      bedrooms: Number(get(18)) || 0,

      // ✅ DESCRIPTION CLEAN
      description: get(20).replace(/<[^>]*>/g, "").trim(),

      // 🔥 IMAGE PRINCIPALE
      image: images[0] || "/placeholder.jpg",

      // 🔥 GALERIE
      images: images,

      lat: 49.119,
      lng: 6.176,

      amenities: [],
    };
  });
}