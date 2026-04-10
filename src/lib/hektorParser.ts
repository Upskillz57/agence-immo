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
    const cols = line.split('"!#"');

    const clean = (val: string) =>
      val?.replace(/"/g, "").trim() || "";

    return {
      id: clean(cols[1]) || index.toString(),

      title: clean(cols[20]),

      city: clean(cols[5]),

      price: Number(clean(cols[10])) || 0,

      type: clean(cols[3]),

      // 🔥 CORRECTIONS ICI
      surface: Number(clean(cols[16])) || 0,
      bedrooms: Number(clean(cols[19])) || 0,
      bathrooms: Number(clean(cols[18])) || 0,

      // 🔥 CLEAN HTML
      description: clean(cols[21]).replace(/<[^>]*>/g, ""),

      image:
        cols.find((c) => c.includes("http"))?.replace(/"/g, "") ||
        "/placeholder.jpg",

      lat: 49.119,
      lng: 6.176,

      amenities: [],
    };
  });
}