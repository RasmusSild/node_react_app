const mongoose = require("mongoose");
const crypto = require('crypto');
const Schema = mongoose.Schema;

let UserSchema = new Schema(
    {
        email: {type: String, unique: true},
        hash: String,
        salt: String,
        isVerified: { type: Boolean, default: false },
        passwordResetToken: String,
        passwordResetExpires: Date
    },
    { timestamps: true }
);

UserSchema.methods.setPassword = function(password) {
        this.salt = crypto.randomBytes(16).toString('hex');
        this.hash = crypto.pbkdf2Sync(password, this.salt,
            1000, 64, `sha512`).toString(`hex`);
};

UserSchema.methods.validPassword = function(password) {
        let hash = crypto.pbkdf2Sync(password,
            this.salt, 1000, 64, `sha512`).toString(`hex`);
        return this.hash === hash;
};

module.exports = mongoose.model("User", UserSchema);