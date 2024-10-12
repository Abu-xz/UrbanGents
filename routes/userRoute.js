import express from 'express';
import {
    loadSignup,
    userSignup,
    checkOtp
} from "../controllers/user/userController.js"

const userRouter = express.Router();

//signup routes management
userRouter.get('/signup', loadSignup);
userRouter.post('/signup', userSignup);

// OTP route management
userRouter.get('/createOtp', checkOtp);





export default userRouter;