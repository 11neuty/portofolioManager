// server/scripts/exportSwagger.js
const fs = require("fs");
const path = require("path");
const { swaggerSpec } = require("../swagger"); // pastikan path ini sesuai

const outputPath = path.join(__dirname, "../docs/swagger.json");

fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2));
console.log("✅ swagger.json berhasil diekspor ke server/docs/swagger.json");
