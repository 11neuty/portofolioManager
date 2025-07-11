const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1]; // ✅ hanya ambil token setelah "Bearer"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id; // ✅ isi req.user dengan ID user
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is invalid" });
  }
};

module.exports = authMiddleware;
