const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  isLoggedIn: (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.userData = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Your Session Is Not Valid!!" });
    }
  },
};
