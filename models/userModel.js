import mongoose from "mongoose";

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
    displayName:{
        type: String
    } ,
    photo:{
      type: String
    }
  },
  { timestamps: true }
);

const Users = mongoose.model("Users", userSchema);

export default Users;
