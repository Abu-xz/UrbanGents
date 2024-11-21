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

import {
  loadAllProduct,
  loadProductDetails,
} from "../controllers/user/userProductController.js";

import { isUser, userAuth } from "../middleware/userAuth.js";

import {
  addAddress,
  addToWishlist,
  cancelOrder,
  deleteAddress,
  editAddress,
  loadAddress,
  loadEditAddress,
  loadOrders,
  loadProfile,
  loadWallet,
  loadWishlist,
  orderDetails,
  removeItemFromWishlist,
  updateProfile,
} from "../controllers/user/profileController.js";

import {
  addItemToCart,
  checkStock,
  deleteItem,
  loadCart,
  updateQuantity,
  updateSize,
} from "../controllers/user/cartController.js";

import {
  applyCoupon,
  createRazorPayOrder,
  loadCheckout,
  loadOrderPlaced,
  placeOrder,
  removeCoupon,
  verifyPayment,
} from "../controllers/user/checkoutController.js";
import { downloadInvoice } from "../controllers/admin/orderController.js";
// import { loadOrderDetails } from "../controllers/admin/ordercontroller.js";

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
userRouter.get("/all-products", userAuth, loadAllProduct);

// Individual product routes
userRouter.get("/product-details/:productId", loadProductDetails);

// Profile page
userRouter.get("/profile", userAuth, loadProfile);
userRouter.post("/profile/edit", userAuth, updateProfile);

// Address page
userRouter.get("/profile/address", userAuth, loadAddress);
userRouter.post("/profile/address/add", userAuth, addAddress);
userRouter.get("/profile/address/edit", userAuth, loadEditAddress);
userRouter.post("/profile/address/edit", userAuth, editAddress);
userRouter.delete("/profile/address/delete", userAuth, deleteAddress);

// Profile orders
userRouter.get("/profile/orders", userAuth, loadOrders);
userRouter.put("/profile/orders", userAuth, cancelOrder);
userRouter.get("/profile/order-details", userAuth, orderDetails);

// order invoice route here
userRouter.get('/order-invoice', userAuth, downloadInvoice)

//profile wishlist
userRouter.get("/profile/wishlist", userAuth, loadWishlist);
userRouter.post("/profile/wishlist", userAuth, addToWishlist);
userRouter.put('/profile/wishlist', userAuth, removeItemFromWishlist);

// profile wallet 
userRouter.get('/profile/wallet', userAuth, loadWallet)


// Add-To-Cart page route
userRouter.get("/cart", userAuth, loadCart);
userRouter.post("/cart/add", userAuth, addItemToCart);
userRouter.patch("/cart/add", userAuth, updateSize);
userRouter.put("/cart", userAuth, updateQuantity);
userRouter.delete("/cart", userAuth, deleteItem);
userRouter.post("/cart/check-stock", userAuth, checkStock);

// Check out page route
userRouter.get("/checkout", userAuth, loadCheckout);
userRouter.post("/checkout", userAuth, placeOrder);

// coupon apply here
userRouter.post("/checkout/apply-coupon", userAuth, applyCoupon);
userRouter.post("/checkout/remove-coupon", userAuth, removeCoupon);

//razorpay route
userRouter.post("/createRazorpay", userAuth, createRazorPayOrder);
userRouter.post("/verifyPayment", userAuth, verifyPayment);

// load place order page
userRouter.get("/order-placed", loadOrderPlaced);

export default userRouter;
