import express from "express";

import {
  loadLogin,
  isValidAdmin,
  logout,
} from "../controllers/admin/loginController.js";
import {
  loadCustomer,
  customerAction,
} from "../controllers/admin/customerController.js";

import {
  addCategory,
  blockCategory,
  editCategory,
  loadCategory,
  unblockCategory,
} from "../controllers/admin/categoryController.js";

import {
  addProducts,
  loadAddProducts,
  loadEditProduct,
  loadProducts,
  productBlockUnblock,
  updateProduct,
} from "../controllers/admin/productsController.js";

import upload from "../config/multer.js";
import { adminAuth } from "../middleware/adminAuth.js";
import {
  loadOrderDetails,
  loadOrders,
  updateStatus,
} from "../controllers/admin/ordercontroller.js";
import {
  addCoupon,
  deleteCoupon,
  editCoupon,
  loadCoupon,
  loadEditCoupon,
} from "../controllers/admin/couponController.js";
import {
  createOffer,
  loadOffer,
} from "../controllers/admin/offersController.js";
import {
  downloadSalesExcel,
  downloadSalesPdf,
  fetchReport,
  loadSalesReport,
} from "../controllers/admin/salesController.js";
import {
  fetchDashboardData,
  loadDashboard,
} from "../controllers/admin/dashboardController.js";


const noCache = (req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
};

const adminRouter = express.Router();

adminRouter.use(noCache);

//login routes
adminRouter.get("/login", loadLogin);
adminRouter.post("/login", isValidAdmin);

//dashboard routes
adminRouter.get("/dashboard", adminAuth, loadDashboard);
adminRouter.get("/dashboard/fetchData", adminAuth, fetchDashboardData);

//customers routes
adminRouter.get("/customers", adminAuth, loadCustomer);
adminRouter.get("/customers/:action/:userId", adminAuth, customerAction);

// Category routes
adminRouter.get("/category", adminAuth, loadCategory);
adminRouter.post("/addCategory", adminAuth, addCategory);
adminRouter.post("/blockCategory", adminAuth, blockCategory);
adminRouter.post("/unblockCategory", adminAuth, unblockCategory);
adminRouter.post("/editCategory", adminAuth, editCategory);

// Products routes here ....
adminRouter.get("/products", adminAuth, loadProducts);
adminRouter.get("/products/add", adminAuth, loadAddProducts);
adminRouter.post(
  "/products/add",
  upload.array("croppedImages"),
  adminAuth,
  addProducts
);
adminRouter.post("/products/block", adminAuth, productBlockUnblock);
adminRouter.get("/products/edit/:id", adminAuth, loadEditProduct);
adminRouter.post(
  "/products/edit",
  upload.array("croppedImages"),
  adminAuth,
  updateProduct
);

// Order route
adminRouter.get("/orders", adminAuth, loadOrders);
adminRouter.put("/orders", adminAuth, updateStatus);
adminRouter.get("/order-details", adminAuth, loadOrderDetails);

// Coupon route here
adminRouter.get("/coupons", adminAuth, loadCoupon);
adminRouter.post("/coupons", adminAuth, addCoupon);
adminRouter.put("/coupons", adminAuth, editCoupon);
adminRouter.put("/coupons/delete", adminAuth, deleteCoupon);
adminRouter.get("/coupons/:couponId", adminAuth, loadEditCoupon);

// Offer route here
adminRouter.get("/offers", adminAuth, loadOffer);
adminRouter.post("/offers", adminAuth, createOffer);

// Sales report route
adminRouter.get("/sales", adminAuth, loadSalesReport);
adminRouter.get("/sales-report", adminAuth, fetchReport);
adminRouter.get("/sales-pdf", adminAuth, downloadSalesPdf);
adminRouter.get("/sales-excel", adminAuth, downloadSalesExcel);

// admin logout route
adminRouter.get("/logout", logout);
export default adminRouter;
