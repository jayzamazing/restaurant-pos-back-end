const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/serverConfig');

const createAuthToken = user => {
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: 'username',
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};
const authenticated = (req, res, next) => {
  passport.authenticate('basic', {session: false}, (err, user, info) => {
      if (err) {return next(err);}
      if (!user) {return res.redirect('/login');}
      const authToken = createAuthToken(user.apiRepr());
      res.authToken = authToken;
      next();
  })(req, res, next);
};
const authenticatedJWT = (req, res, next) => {
  passport.authenticate('jwt', {session: false}, (err, username, info) => {
      if (err) {return next(err);}
      if (!username) {return res.redirect('/login');}
      const authToken = createAuthToken({username});
      req.username = username;
      res.authToken = authToken;
      next();
  })(req, res, next);
};

module.exports = {authenticated, authenticatedJWT};
