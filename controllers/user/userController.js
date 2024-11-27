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
    const { firstName, lastName, email, phoneNumber, password } = req.body;

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
    res.status(200).redirect("/user/otp");
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error. please try again" });
  }
};

export const loadOtp = async (req, res) => {
  res.status(200).render("user/verifyOtp");
};

export const verifyOtp = async (req, res) => {
  try {
    const now = Date.now();
    const { userOtp } = req.body; // This OTP is from user
    const tempData = await TempData.findOne({ _id: req.session.userId });
    if (!tempData) {
      return res.status(400).json({
        redirect: true,
        message: "Session expired, please sign up again!",
      });
    }
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      expiresAt,
      otp,
    } = tempData;
    if (expiresAt < now) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    if (userOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    const newUser = new Users({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      status: true,
    });

    await newUser.save();

    req.session.email = null;
    req.session.userId = null;
    //session creation

    return res
      .status(200)
      .json({ success: true, message: "User sign-up successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error. please try again" });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const otp = generateOTP();
    const email = req.session?.email;
    const id = req.session?.userId;
    if (id) {
      const expiresAt = Date.now() + 3 * 60 * 1000;
      const updatedTempData = await TempData.findOneAndUpdate(
        { _id: id },
        { otp: otp, expiresAt: expiresAt },
        { new: true } // this return updated doc
      );

      if (!updatedTempData) {
        return res.status(500).redirect("/user/signup");
      }
      await sendOTP(email, otp);
      res.status(200).redirect("/user/otp");
    } else {
      return res.status(500).redirect("/user/signup");
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error. please try again" });
  }
};

export const loadLogin = (req, res) => {
  return res.status(200).render("user/userLogin");
};

export const verifyUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Users.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .render("user/userLogin", { message: "Invalid email or password!" });
    }

    if (user.googleId) {
      return res
        .status(400)
        .render("user/userLogin", { message: "Invalid email or password" });
    }

    const isValidPassword = bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).render("user/userLogin", {
        message: "Invalid email or password",
      });
    }

    req.session.user = {
      id: user._id,
      email: user.email,
    };
    res.status(200).redirect("/user/home");
  } catch (error) {
    return res.status(500).render("user/userLogin");
  }
};

export const forgotPassword = (req, res) => {
  res.render("user/forgotPassword");
};

export const verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Users.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User doesn't exists" });
    }

    const otp = generateOTP();
    const expiresAt = Date.now() * 3 * 60 * 1000;
    req.session.forgotData = { otp, expiresAt, email };

    await sendOTP(email, otp);
    res.json({ success: true, message: `OTP send successfully` });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error. please try again" });
  }
};

export const loadForgotOtp = (req, res) => {
  res.status(200).render("user/forgotOtp");
};

export const verifyForgotOtp = async (req, res) => {
  try {
    const { userOtp } = req.body;
    const now = Date.now();

    if (!req.session.forgotData) {
      return res
        .status(500)
        .json({ redirect: true, message: "Please try again" });
    }

    const { otp, expiresAt } = req.session.forgotData;
    if (expiresAt < now) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    } else if (Number(userOtp) != otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    } else {
      return res.status(200).json({ success: true });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred during OTP verification",
    });
  }
};

//middleware for resend otp
export const forgotResend = async (req, res) => {
  try {
    const otp = generateOTP();
    const expiresAt = Date.now() + 3 * 60 * 1000;
    if (!req.session.forgotData) {
      res.status(500).redirect("/user/login");
    }
    const { email } = req.session.forgotData;
    req.session.forgotData.otp = otp;
    req.session.forgotData.expiresAt = expiresAt;
    if (!req.session.forgotData) {
      return res.status(500).redirect("/user/login");
    }
    await sendOTP(email, otp);
    res.status(200).redirect("/user/forgotOtp"); //for test
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error. please try again" });
  }
};

export const changePassword = (req, res) => {
  res.status(200).render("user/changePassword");
};

export const resetPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const { email } = req.session.forgotData;
    const password = await bcrypt.hash(newPassword, 10);
    const user = await Users.findOneAndUpdate(
      { email },
      { password: password }
    );
    user.save();
    res.status(200).redirect("/user/login");
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error. please try again" });
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
    }
    res.clearCookie("connect.sid");
    res.redirect("/user/login");
  });
};
