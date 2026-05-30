const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send("Please Login First")
    }

    const decodeMessage = jwt.verify(token, "Rahul@123");

    const { _id } = decodeMessage;

    const user = await User.findOne({ _id: _id });

    req.user=user;
    next();

  } catch (err) {
    res.status(400).send("Error : "+ err.message)
  }
};

module.exports = {userAuth};
