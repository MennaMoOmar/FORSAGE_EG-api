const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config");

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const signedData = jwt.verify(authorization, jwtSecret);
    console.log({ signedData });
    req.id = signedData.id;
    next();
  } catch (error) {
    res.send("Please try sign in again with correct data!");
  }
};
