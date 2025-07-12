const { createLogger, format, transports } = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const path = require("path");
const fs = require("fs");

// Pastikan direktori log tersedia
const logDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Format log: [timestamp] LEVEL: message
const logFormat = format.printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
});

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    logFormat
  ),
  transports: [
    // Log info dan lainnya (rotasi mingguan + zip)
    new DailyRotateFile({
      filename: path.join(logDir, "combined-%DATE%.log"),
      datePattern: "YYYY-ww",       // Per minggu (ISO week)
      zippedArchive: true,          // 🔥 Aktifkan kompresi
      maxFiles: "4w",               // Simpan maksimal 4 minggu
    }),
    // Log khusus error (rotasi mingguan + zip)
    new DailyRotateFile({
      filename: path.join(logDir, "error-%DATE%.log"),
      datePattern: "YYYY-ww",
      zippedArchive: true,          // 🔥 Aktifkan kompresi
      level: "error",
      maxFiles: "4w",
    }),
  ],
});

// Tampilkan ke console juga saat development
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), logFormat),
    })
  );
}

module.exports = logger;
