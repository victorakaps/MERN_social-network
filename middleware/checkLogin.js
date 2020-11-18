const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = mongoose.model("User");
const { JWT_SECRET } = require("../keys");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "authentication required" });
  }
  const bearer_token = authorization.replace("Bearer ", "");
  jwt.verify(bearer_token, JWT_SECRET, (e, payload) => {
    if (e) {
      return res.status(401).json({ error: "authentication required" });
    }
    const { _id } = payload;
    User.findById(_id).then((user) => {
      req.user = user;
      next();
    });
  });
};
