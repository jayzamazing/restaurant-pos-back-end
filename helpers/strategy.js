const passport = require('passport');
const {BasicStrategy} = require('passport-http');
const {User} = require('../models/users');
const {Strategy: JwtStrategy, ExtractJwt} = require('passport-jwt');
const {JWT_SECRET} = require('../config/serverConfig');
//strategy to verify the user against
const basicStrategy = new BasicStrategy(
  (email, password, cb) => {
    let user;
    User.findOne({email: email})
    .exec()
    .then(_user => {
      user = _user;
      //if the user does not exist
      if (!user) {
        return Promise.reject({
            code: 401,
            reason: 'ValidationError',
            message: 'Incorrect username or password',
            location: 'email'
        });

      }
      //otherwise try and validate the password
      return user.validatePassword(password);
    })
    .then(isValid => {
      //if the password is incorrect
      if (!isValid) {
        return Promise.reject({
          code: 401,
          reason: 'ValidationError',
          message: 'Incorrect username or password',
          location: 'email'
        });
      } else {
        return cb(null, user);
      }
    })
    .catch(err => cb(err));
  }
);

const jwtStrategy = new JwtStrategy({
  secretOrKey: JWT_SECRET,
  // Look for the JWT as a Bearer auth header
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  // Only allow HS256 tokens - the same as the ones we issue
  algorithms: ['HS256']
},
(payload, done) => {
  done(null, payload.user);
}
);

module.exports = {basicStrategy, jwtStrategy};
