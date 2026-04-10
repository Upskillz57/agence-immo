import fs from "fs";

export function parseHektorCSV() {
  const filePath =
    process.env.NODE_ENV === "production"
      ? "/home/hektorftp/export/Annonces.csv"
      : "data/Annonces.csv";

  if (!fs.existsSync(filePath)) {
    throw new Error("CSV file not found");
  }

  const file = fs.readFileSync(filePath, "latin1");

  const lines = file.split("\n").filter(Boolean);

  return lines.map((line, index) => {
    const cols = line.split("!#").map((c) => c.replace(/"/g, "").trim());

    const get = (i: number) => cols[i] || "";

    // 🔥 RÉCUP IMAGES AUTO
    const images = cols.filter((c) => c.includes("http"));

    return {
      id: get(1) || index.toString(),

      // ✅ TITRE COURT
      title: get(19),

      // ✅ TYPE
      type: get(3),

      // ✅ LOCALISATION
      city: get(5),

      // ✅ PRIX FIX
      price: Number(get(10)) || 0,

      // ✅ SURFACE FIX
      surface: Number(get(15)) || 0,

      // ✅ PIÈCES
      bedrooms: Number(get(17)) || 0,

      // ✅ CHAMBRES
      rooms: Number(get(18)) || 0,

      // ✅ DESCRIPTION CLEAN
      description: get(20).replace(/<[^>]*>/g, ""),

      // 🔥 IMAGE RÉELLE (FINI LE 404)
      image: images[0] || "/placeholder.jpg",

      // 🔥 GALERIE
      images: images,

      lat: 49.119,
      lng: 6.176,

      amenities: [],
    };
  });
}