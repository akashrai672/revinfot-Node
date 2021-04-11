const jwt = require("jsonwebtoken");
const jwtKEY = require("../constants");
module.exports = {
  Auth: async (req) => {
    var token =
      (req.headers.authorization
        ? req.headers.authorization.split(" ")[1]
        : "") ||
      (req.body && req.body.access_token) ||
      req.body.token ||
      req.query.token ||
      req.headers["x-access-token"];
    try {
      const decode = jwt.decode(token, jwtKEY.jwtSecret);
      return decode.data;
    } catch (err) {
      return err;
    }
  },
};
