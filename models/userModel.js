import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  pincode: {
    type: Number,
  },
  addressType: {
    type: String,
    enum: ["home", "office"],
  },
  state: {
    type: String,
  },
  number: {
    type: Number,
  },
  city: {
    type: String,
  },
  landmark: {
    type: String,
  },
  district: {
    type: String,
  },
  address: {
    type: String,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      default: 0,
    },
    orderId: {
      type: String,
    },
    transactionType: {
      type: String,
      enum: ["Credit", "Debit"],
    },
    transactionDate: {
      type: Date,
      required: true,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    phoneNumber: {
      type: Number,
    },
    status: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
    },
    displayName: {
      type: String,
    },
    photo: {
      type: String,
    },
    addresses: [addressSchema], //store array of address
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    walletAmount: {
      type: Number,
      default: 0, // Start with a balance of 0
    },
    transaction: [transactionSchema],
  },
  { timestamps: true }
);

const Users = mongoose.model("Users", userSchema);

export default Users;
