import mongoose from "mongoose";

const User = require("../model/userSchema");

const Wallet = mongoose.model("Wallet", walletSchema);
export default Wallet;