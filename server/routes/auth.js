const express = require('express');
const router  = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const UserLoginModel = require("../models/userLoginModel");
const i18n = require('i18n');
require('dotenv').config();

/**
 * Kasutaja sisse logimine.
 * Kontrollib, kas kasutajakonto eksisteerib, kas parool on õige ja kas konto on kinnitatud.
 * Kasutaja sisselogimiste tabelit täiendab andmebaasis uue kirjega.
 * Geneerib ja tagastab JWT Tokeni, mille alusel toimub edasiste päringute valideerimine.
 */
router.post('/login', (req, res, next) => {
    i18n.setLocale(req.cookies.lang);
    passport.authenticate('local', {session: false}, (err, user) => {
        if (err) {
            return res.status(500).send(
                {
                    error: i18n.__('login.authError')
                }
            );
        }
        if (!user) {
            return res.status(400).send(
                {
                    error: i18n.__('login.invalid')
                }
            );
        }
        if (!user.isVerified) {
            return res.status(401).send(
                {
                    error: i18n.__('login.notVerified')
                }
            );
        }

        req.login(user, {session: false}, (err) => {
            if (err) {
                return res.status(500).send(
                    {
                        error: i18n.__('login.authError')
                    }
                );
            }

            let loginRecord = new UserLoginModel({_userId: user._id});
            loginRecord.save((err) => {
                if (err) {
                    return res.status(500).send(
                        {
                            error: i18n.__('db.dbError')
                        }
                    );
                }
                const token = jwt.sign(
                    {
                        email: user.email,
                        password: user.password
                    },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: '10h' }
                );
                return res.send({user, token});
            });
        });
    })(req, res);
});

module.exports = router;