import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    address: {
      type: Object,
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        selectedSize: { type: String, required: true },
        quantity: { type: Number, required: true },
        subTotal: { type: Number, required: true },
        subDiscount: { type: Number, required: true },
        status: {
          type: String,
          enum: ["pending", "delivered", "shipped", "cancelled", "refunded", "returned"],
          default: "pending",
        },
        paymentMethod: { type: String, enum: ["razorpay", "COD", "wallet"] },
      },
      { timestamps: true },
    ],
    status: {
      type: String,
      default: "pending",
    },
    paymentStatus: {
      type: String,
      default: "pending"
    },
    totalPrice: { type: Number, required: true },
    totalDiscount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
