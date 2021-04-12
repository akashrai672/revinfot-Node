/** @format */
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const UserModel = require("../models/user");
const { secretKey } = require("../constants/index");
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secretKey;
opts.ignoreExpiration = true;
module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      let to = new Date();
      let today = Math.ceil(to.getTime() / 1000);
      jwt_payload = jwt_payload.data;
      if (jwt_payload.exp < today) {
        return done(null, "UnAuthorized");
      }
      UserModel.findOne({
        _id: jwt_payload.id,
        deviceId: jwt_payload.deviceId,
        status: true,
      })
        .lean()
        .then((user) => {
          if (user) {
            return done(null, user);
          } else {
            return done(null, "UnAuthorized");
          }
        })
        .catch((err) => {
          console.log(err);
          console.log("Some error in passport");
        });
    })
  );
};
