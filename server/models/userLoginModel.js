const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Andmebaasimudel konkreetse kasutaja sisselogimiste dokumenteerimiseks
 */
const LoginSchema = new Schema(
    {
        _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        createdAt: { type: Date, required: true, default: Date.now }
    }
);

module.exports = mongoose.model("UserLogin", LoginSchema);