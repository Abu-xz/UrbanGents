import mongoose from "mongoose";

const tempDataSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      require: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
        type: String, //user typed string 
        required: true,
    },
    expiresAt: {
        type: Number,
        required: true
    }
  },
  { capped: { size: 5500, max: 50 } }
);

const TempData = mongoose.model('tempData', tempDataSchema);

export default TempData;

