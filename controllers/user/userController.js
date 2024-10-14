import { sendOTP, generateOTP } from "../../utils/email.js";
import bcrypt from "bcrypt";
import Users from "../../models/userModel.js";
import TempData from "../../models/tempDataModel.js";

//signup management
export const loadSignup = (req, res) => {
  res.status(200).render("user/userSignup");
};

export const userSignup = async (req, res) => {
  try {
    const otp = generateOTP();
    console.log(`first otp ${otp}`)
    const { firstName, lastName, email, phoneNumber, password } = req.body;
    // req.session.email = email;
    // console.log(req.session.email);
    const userExist = await Users.findOne({ email });
    if (userExist) {
      return res.status(200).render("user/userSignup", {
        error: "User already exists. Try another one",
      });
    }

    await sendOTP(email, otp);
    const expiresAt = Date.now() + 3 * 60 * 1000;

    // insert temp data to tempData DB
    const hashPassword = await bcrypt.hash(password, 10); // parameter (actualPass, salt)

    const tempData = new TempData({
      firstName,
      lastName,
      email,
      expiresAt,
      phoneNumber,
      password: hashPassword,
      otp,
    });
    const savedTempData = await tempData.save();
    req.session.userId = savedTempData._id;
    req.session.email = savedTempData.email;
    console.log("session created with _id : " + req.session.userId);
    // console.log("temp data saved");
    res.status(200).redirect("/user/otp");
  } catch (error) {
    console.log(error.message);
  }
};

export const loadOtp = async (req, res) => {
  // console.log(req.session.email);
  res.status(200).render("user/verifyOtp");
};

export const verifyOtp = async (req, res) => {
  try {
    console.log("axios route reached");
    const now = Date.now();
    const { otp } = req.body; // This OTP is from user
    const tempData = await TempData.findOne({ otp: otp });
    if (!tempData) {
      console.log("otp didn't match");
      return res
        .status(400)
        .json({ success: false, errorMessage: "Please enter valid OTP" });
    }
    const { firstName, lastName, email, phoneNumber, password, expiresAt } =
      tempData;

    if (expiresAt < now) {
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new one",
      });
    }
    req.session.email = null;
    req.session.userId = null;
    const newUser = new Users({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
    });
    await newUser.save();
    res
      .status(200)
      .json({ success: true, message: "User sign-up successfully" });
  } catch (error) {
    console.log(error);
  }
};

export const resendOtp = async (req, res, next) => {
  try {
    console.log("otp resend success");
    // console.log(req.session?.email);
    const otp = generateOTP();
    console.log(`newGen otp ${otp}`)
    const email = req.session?.email;
    const id = req.session?.userId;
    console.log(email, id)
    if (id) {
      const expiresAt = Date.now() + 3 * 60 * 1000;
      await TempData.findOneAndUpdate(
        { _id: id},
        { otp: otp, expiresAt: expiresAt }
      );
      await sendOTP(email, otp);
      next();
    } else {
      res.status(500).redirect("/user/signup");
    }
  } catch (error) {
    console.log(error.message);
  }
};
