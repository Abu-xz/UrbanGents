import express from 'express';
import {
    loadSignup,
    userSignup,
    loadOtp,
    verifyOtp,
    resendOtp,
} from "../controllers/user/userController.js"



const userRouter = express.Router();

//signup routes management
userRouter.get('/signup', loadSignup);
userRouter.post('/signup', userSignup);

// OTP route management
userRouter.get('/otp', loadOtp);
userRouter.post('/otp', verifyOtp);
userRouter.get('/resendOtp', resendOtp, loadOtp);

userRouter.get('/login', (req,res) => {
    res.send('otp verified')
})




export default userRouter;