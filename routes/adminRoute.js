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
adminRouter.post('/blockCategory', blockCategory)
adminRouter.post('/unblockCategory', unblockCategory);
adminRouter.post('/editCategory', editCategory)


adminRouter.get('/products', (req, res) => {
  res.render('admin/product')
})

export default adminRouter;