const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const clinicWalletSchema = new Schema({
    Wallet: {
        type: Number,
        default: 0,
        required: false
    }
}, {timestamps: true});

const ClinicWallet = mongoose.model("ClinicWallet", clinicWalletSchema, "ClinicWallet");
module.exports = ClinicWallet;