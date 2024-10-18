import express from "express";
import {
  loadSignup,
  userSignup,
  loadOtp,
  verifyOtp,
  resendOtp,
  loadLogin,
  verifyUser,
  forgotPassword,
  verifyEmail,
  loadForgotOtp,
  verifyForgotOtp,
  forgotResend,
  changePassword,
  resetPassword,
} from "../controllers/user/userController.js";

const userRouter = express.Router();

//signup routes management
userRouter.get("/signup", loadSignup);
userRouter.post("/signup", userSignup);

// OTP route management
userRouter.get("/otp", loadOtp);
userRouter.post("/otp", verifyOtp);
userRouter.get("/resendOtp", resendOtp);

// login routes
userRouter.get("/login", loadLogin);
userRouter.post("/login", verifyUser);

// Forgot password
userRouter.get("/forgotPassword", forgotPassword);
userRouter.post('/forgotPassword', verifyEmail);

userRouter.get('/forgotOtp', loadForgotOtp);
userRouter.post('/forgotOtp', verifyForgotOtp);
userRouter.get('/forgotResend', forgotResend);

userRouter.get('/changePassword', changePassword)
userRouter.get('/changePassword', resetPassword)






export default userRouter;
