import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountPercentage: { type: Number, required: true },
  expiryDate: { type: String, required: true },
  startDate: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  usageLimit: { type: Number, default: 0 },
});

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
