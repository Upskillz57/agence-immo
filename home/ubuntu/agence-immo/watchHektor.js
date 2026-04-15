const fs = require("fs");
const { exec } = require("child_process");

const zipPath = "/home/hektorftp/export/nemestia.zip";
const extractPath = "/home/hektorftp/export/data";

let lastModified = 0;

console.log("👀 Watching Hektor ZIP (safe mode)...");

setInterval(() => {
  try {
    const stats = fs.statSync(zipPath);
    const currentModified = stats.mtimeMs;

    if (currentModified !== lastModified) {
      lastModified = currentModified;

      console.log("📦 ZIP updated detected, waiting 2s...");

      // ⏳ attendre que Hektor finisse d’écrire
      setTimeout(() => {
        exec(
          `sudo -u hektorftp unzip -o ${zipPath} -d ${extractPath}`,
          (error) => {
            if (error) {
              console.error("❌ Unzip error:", error);
              return;
            }

            console.log("✅ Extraction OK");
          }
        );
      }, 2000);
    }
  } catch (err) {
    console.error("❌ Watch error:", err.message);
  }
}, 5000);
