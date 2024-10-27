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
  logout,
} from "../controllers/user/userController.js";

import { loadHome } from "../controllers/user/userHomeController.js";
import { loadProductDetails } from "../controllers/user/userProductController.js";
import { isUser, userAuth } from "../middleware/userAuth.js";
import { loadProfile, updateProfile } from "../controllers/user/profileController.js";


const noCache = (req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
};

const userRouter = express.Router();

userRouter.use(noCache);
//signup routes management
userRouter.get("/signup", isUser, loadSignup);
userRouter.post("/signup", isUser, userSignup);

// logout route page
userRouter.get("/logout", logout);

// OTP route management
userRouter.get("/otp", loadOtp);
userRouter.post("/otp", verifyOtp);
userRouter.get("/resendOtp", resendOtp);

// login routes
userRouter.get("/login", isUser, loadLogin);
userRouter.post("/login", isUser, verifyUser);

// Forgot password
userRouter.get("/forgotPassword", isUser, forgotPassword);
userRouter.post("/forgotPassword", isUser, verifyEmail);

userRouter.get("/forgotOtp", isUser, loadForgotOtp);
userRouter.post("/forgotOtp", isUser, verifyForgotOtp);
userRouter.get("/forgotResend", isUser, forgotResend);

//change password
userRouter.get("/changePassword", isUser, changePassword);
userRouter.get("/changePassword", isUser, resetPassword);

//home page routes
userRouter.get("/home", userAuth, loadHome);

// All product route //
userRouter.get("/all-products", userAuth, (req, res) => {
  res.render("user/shop");
}); // Next week task

// Individual product routes
userRouter.get("/product-details/:productId", loadProductDetails);

// Profile page
userRouter.get('/profile',userAuth, loadProfile);
userRouter.post('/profile/edit', userAuth, updateProfile)


export default userRouter;
