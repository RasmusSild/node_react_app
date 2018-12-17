const express = require('express');
const i18n = require('i18n');
const router  = express.Router();
const UserModel = require("../models/userModel");
const VerificationToken = require("../models/verificationTokenModel");

/**
 * Kasutajakonto kinnitamine.
 * Serveerib html lehe, mis annab kasutajale aimu konto kinnitamise, kasutaja olemasolu või ka tokeni aegumise kohta.
 * Parameetriteks kinnitustoken ja rakenduse keel teate tõlkimise jaoks.
 */
router.get("/confirmation/:lang/:token", (req, res) => {
    i18n.setLocale(req.params.lang);
    VerificationToken.findOne({ token: req.params.token }, (err, token) => {
        if (!token) {
            res.render('emailConfirmation', {
                text: i18n.__('confirmation.expiredToken')
            });
        }

        UserModel.findOne({ _id: token._userId }, (err, user) => {
            if (!user) {
                return res.render('emailConfirmation', {
                    text: i18n.__('confirmation.noUser')
                });
            }
            if (user.isVerified) {
                return res.render('emailConfirmation', {
                    text: i18n.__('confirmation.alreadyVerified')
                });
            }

            user.isVerified = true;
            user.save((err) => {
                if (err) {
                    return res.render('emailConfirmation', {
                        text: i18n.__('db.dbError')
                    });
                }
                return res.render('emailConfirmation', {
                    text: i18n.__('confirmation.verifiedSuccess')
                });
            });
        });
    });
});

module.exports = router;