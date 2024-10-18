import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit otp
};

export const sendOTP = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for Signup",
      text: `Your OTP code is ${otp}. It will expire in 3 minutes.`,
    };
    let isProcessing = false;
   async function debounce (){
      if(isProcessing)return;
      isProcessing = true;
      await transporter.sendMail(mailOptions);
    };
    setTimeout(() => {
      isProcessing = false;
    }, 3000);

    debounce();
    
   
  } catch (error) {
    console.log(error.message);
  }
};


