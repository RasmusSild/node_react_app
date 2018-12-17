const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const logger = require("morgan");
const exphbs = require('express-handlebars');
const i18n = require('i18n');

const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const confirmRoutes = require('./routes/confirmation');

const app = express();

require('./auth/passport');
require('dotenv').config();

mongoose.Promise = global.Promise;
mongoose.connect(
    process.env.DB_CONN,
    { useNewUrlParser: true }
);

let db = mongoose.connection;
db.once("open", () => console.log("Database connection successful"));
db.on("error", console.error.bind(console, "Database connection error:"));

i18n.configure({
    locales: ['en', 'et'],
    cookie: 'lang',
    directory: __dirname + '/locales'
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(i18n.init);
app.use(logger("dev"));

let hbs = exphbs.create({});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/account', confirmRoutes);
app.use((req,res) => {
    res.render('404', {
        text: '404'
    });
});

app.listen(process.env.PORT, () => console.log(`SERVER STARTED, LISTENING ON PORT ${process.env.PORT}`));