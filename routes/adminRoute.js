import express from "express";
import {
  loadLogin,
  isValidAdmin,
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

const adminRouter = express.Router();

//login routes
adminRouter.get("/login", loadLogin);
adminRouter.post("/login", isValidAdmin);

//dashboard routes
adminRouter.get("/dashboard", loadDashboard);

//customers routes
adminRouter.get("/customers", loadCustomer);
adminRouter.get("/customers/:action/:userId", customerAction);

// Category routes
adminRouter.get("/category", loadCategory);
adminRouter.post("/addCategory", addCategory);
adminRouter.post("/blockCategory", blockCategory);
adminRouter.post("/unblockCategory", unblockCategory);
adminRouter.post("/editCategory", editCategory);

// Products routes here ....
adminRouter.get("/products", loadProducts);
adminRouter.get("/products/add", loadAddProducts);
adminRouter.post('/products/add', upload.array('croppedImages'), addProducts);
adminRouter.post('/products/block', productBlockUnblock)
adminRouter.get('/products/edit/:id', loadEditProduct);
adminRouter.post('/products/edit', upload.array('croppedImages'), updateProduct)

export default adminRouter;
