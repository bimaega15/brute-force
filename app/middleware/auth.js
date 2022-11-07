const jwt = require("jsonwebtoken");
require("dotenv").config();

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      next();
    } catch (error) {
      res.status(401).json({
        status: 401,
        message: "User access ditolak",
        result: error.message,
      });
    }
  }

  if (!token) {
    res.status(401).json({
      status: 401,
      message: "User access ditolak",
    });
  }
};

module.exports = {
  protect,
};
