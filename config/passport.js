const JwtStratergy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const passport = require('passport');
const User = mongoose.model('users');
const keys = require('./keys');

const optns = {};

optns.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
optns.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  passport.use(
    new JwtStratergy(optns, (jwt_payload,done)=>{
      User.findById(jwt_payload.id)
      .then(user=> {
        if(user)
        {return done(null, user);}
        return done(null,false);
      })
      .catch(err => console.log(err));
    })
  );
};
