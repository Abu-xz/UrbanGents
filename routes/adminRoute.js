import express from 'express';
import { 
    adminLogin,
    isValidAdmin 
} from '../controllers/admin/loginController.js';

const adminRouter = express.Router();

//login routes
adminRouter.get('/login', adminLogin);
adminRouter.post('/login', isValidAdmin)


export default adminRouter;

