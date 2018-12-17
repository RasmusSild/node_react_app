const passport    = require('passport');
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy   = passportJWT.Strategy;
const UserModel = require("../models/userModel");
require('dotenv').config();

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    (email, password, cb) => {
        UserModel.findOne({email: email}, (err, user) => {
            if (err) {
                return cb(err);
            }
            if (!user) {
                return cb(null, false);
            }
            if (!user.validPassword(password)) {
                return cb(null, false);
            }
            return cb(null, user);
        });
    }
));

passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : process.env.JWT_SECRET_KEY
    },
    (jwtPayload, cb) => {
        if (jwtPayload.expires > Date.now()) {
            return cb('jwt expired');
        }
        return cb(null, jwtPayload);
    }
));
