import express from "express";
import {
  loadLogin,
  isValidAdmin,
  logout,
} from "../controllers/admin/loginController.js";
import {
  loadCustomer,
  loadDashboard,
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


const noCache = (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
};


const adminRouter = express.Router();

adminRouter.use(noCache);
//login routes
adminRouter.get("/login", loadLogin);
adminRouter.post("/login", isValidAdmin);

//dashboard routes
adminRouter.get("/dashboard", adminAuth, loadDashboard);

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
adminRouter.post('/products/add', upload.array('croppedImages'), adminAuth, addProducts);
adminRouter.post('/products/block', adminAuth, productBlockUnblock)
adminRouter.get('/products/edit/:id', adminAuth, loadEditProduct);
adminRouter.post('/products/edit', upload.array('croppedImages'), adminAuth, updateProduct);
adminRouter.get('/logout', logout)

export default adminRouter;
