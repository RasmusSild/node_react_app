const express = require('express');
const router  = express.Router();
const emailValidator = require("email-validator");
const passport = require('passport');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const expressHbs = require('express-handlebars');
const nodemailerHbs = require('nodemailer-express-handlebars');
const i18n = require('i18n');

const UserModel = require("../models/userModel");
const VerificationToken = require("../models/verificationTokenModel");
const UserLoginModel = require("../models/userLoginModel");

const hbsEngine = expressHbs.create({});
const mailerHbsOptions = {
    viewEngine: hbsEngine.engine,
    viewPath: 'views/',
    extName: '.handlebars'
};
require('dotenv').config();

router.get("/usersList", (req, res) => {
    i18n.setLocale(req.cookies.lang);
    passport.authenticate('jwt', {session: false}, (err, success) => {
        if (err) {
            return res.send(i18n.__('login.authError'));
        }
        UserModel.find((err, data) => {
            if (err) {
                return res.status(500).send(
                    {
                        success: false,
                        error: i18n.__('db.dbError')
                    }
                );
            }
            return res.send({ success: true, data: data });
        });
    })(req, res);
});

router.get("/userLogins/:id", (req, res) => {
    passport.authenticate('jwt', {session: false}, (err, success) => {
        if (err) {
            return res.send(i18n.__('login.authError'));
        }
        UserLoginModel.find({ _userId: req.params.id}, (err, data) => {
            if (err) {
                return res.status(500).send(
                    {
                        success: false,
                        error: i18n.__('db.dbError')
                    }
                );
            }
            return res.send({ data: data });
        });
    })(req, res);
});

router.post("/signUp", (req, res) => {
    i18n.setLocale(req.cookies.lang);
    const { email, password } = req.body;
    const isValidEmail = emailValidator.validate(email);

    if (!isValidEmail) return res.status(400).send({error: i18n.__('signUp.invalidEmail')});
    if (!password) return res.status(400).send({error: i18n.__('signUp.noPassword')});
    if (password.length < 8) return res.status(400).send({error: i18n.__('signUp.passwordLength')});

    let user = new UserModel();
    user.email = email;
    user.setPassword(password);

    UserModel.findOne({ email: email }, (err, userExists) => {
        if (userExists) return res.status(400).send({ error: i18n.__('signUp.emailInUse') });

        user.save(err => {
            if (err) {
                return res.status(500).send(
                    {
                        success: false,
                        error: i18n.__('db.dbError')
                    }
                );
            }

            let token = new VerificationToken({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

            token.save(err => {
                if (err) {
                    return res.status(500).send(
                        {
                            success: false,
                            error: i18n.__('db.dbError')
                        }
                    );
                }

                let transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
                transporter.use('compile', nodemailerHbs(mailerHbsOptions));

                let mailOptions = {
                    from: 'rasmus.sild94@gmail.com',
                    to: user.email,
                    subject: i18n.__('mail.verificationEmailSubject'),
                    template: 'verificationEmail',
                    context: {
                        text: i18n.__('mail.verificationEmailContent'),
                        link : 'http:\/\/' + req.headers.host + '\/account\/confirmation\/' + req.cookies.lang + '\/' + token.token
                    }
                };
                transporter.sendMail(mailOptions,err => {
                    if (err) {
                        return res.status(500).send(
                            {
                                error: i18n.__('mail.error')
                            }
                        );
                    }
                    res.status(200).send({ message: i18n.__('mail.verificationSent') + user.email + '.' });
                });
            });
        });
    });
});

router.post("/resetPassword", (req, res) => {
    const { email } = req.body;
    const isValidEmail = emailValidator.validate(email);

    if (!isValidEmail) return res.status(400).send({error: i18n.__('signUp.invalidEmail')});

    const newPwd = crypto.randomBytes(8).toString('hex').slice(0, 8);
    let newData = new UserModel();
    newData.setPassword(newPwd);

    UserModel.findOneAndUpdate({email: email}, {hash: newData.hash, salt: newData.salt},{new: true}).exec()
        .then((user) =>{
            if (!user) return res.status(400).send({ error: i18n.__('reset.noAccount') });

            let transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
            transporter.use('compile', nodemailerHbs(mailerHbsOptions));

            let mailOptions = {
                from: 'rasmus.sild94@gmail.com',
                to: user.email,
                subject: i18n.__('mail.newPwdEmailSubject'),
                template: 'newPwdEmail',
                context: {
                    text: i18n.__('mail.newPwdEmailContent'),
                    pwd : newPwd
                }
            };
            transporter.sendMail(mailOptions,(err) => {
                if (err) { return res.status(500).send({ error: i18n.__('mail.error') }); }
                res.status(200).send({ message: i18n.__('mail.resetSent') + user.email + '.' });
            });
        })
        .catch( (error) => {
            return res.status(500).send(
                {
                    success: false,
                    error: i18n.__('db.dbError')
                }
            );
        });

});

router.delete("/deleteUser/:id", (req, res) => {
    i18n.setLocale(req.cookies.lang);
    passport.authenticate('jwt', {session: false}, (err, success) => {
        if (err) {
            return res.send(i18n.__('login.authError'));
        }
        const id = req.params.id;
        UserModel.findOneAndDelete({_id: id}, (err, result) => {
            if (err) {
                return res.status(500).send(
                    {
                        success: false,
                        error: i18n.__('db.dbError')
                    }
                );
            }
            let transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
            transporter.use('compile', nodemailerHbs(mailerHbsOptions));

            let mailOptions = {
                from: 'rasmus.sild94@gmail.com',
                to: result.email,
                subject: i18n.__('mail.deletedEmailSubject'),
                template: 'textTemplate',
                context: {
                    text: i18n.__('mail.deletedEmailContent')
                }
            };
            transporter.sendMail(mailOptions,(err) => {
                if (err) {
                    return res.status(500).send(
                        {
                            error: i18n.__('mail.error')
                        }
                    );
                }
                res.send({ message: i18n.__('delete.success') });
            });
        });
    })(req, res);
});

module.exports = router;