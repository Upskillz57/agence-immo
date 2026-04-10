import fs from "fs";

export function parseHektorCSV() {
    const filePath =
    process.env.NODE_ENV === "production"
      ? "/home/hektorftp/export/Annonces.csv"
      : "data/Annonces.csv";
      
  console.log("CHECK FILE:", filePath);
  console.log("EXISTS:", fs.existsSync(filePath));

  if (!fs.existsSync(filePath)) {
    throw new Error("CSV file not found");
  }

  const file = fs.readFileSync(filePath, "latin1");

  const lines = file.split("\n").filter(Boolean);

  return lines.map((line, index) => {
    const cols = line.split('"!#"'); // ✅ BON SEPARATEUR

    return {
      id: cols[1]?.replace(/"/g, "") || index.toString(),
      title: cols[20]?.replace(/"/g, "") || "Bien",
      city: cols[5]?.replace(/"/g, ""),
      price: Number(cols[10]?.replace(/"/g, "")) || 0,
      type: cols[3]?.replace(/"/g, ""),
      surface: Number(cols[16]) || 0,
      bedrooms: Number(cols[19]) || 0,
      bathrooms: Number(cols[18]) || 0,

      image:
        cols.find((c) => c.includes("http"))?.replace(/"/g, "") || "",

      lat: 49.119,
      lng: 6.176,

      amenities: [],
    };
  });
}