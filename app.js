import express from "express";
import dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import connectDb from "./utils/db.js";
import adminRouter from "./routes/adminRoute.js";
import userRouter from "./routes/userRoute.js";

const app = express();

dotenv.config();

const PORT = process.env.PORT || 3000;

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//view engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended:true}));
app.use(express.json());
//serving static files js,css,images
app.use(express.static("public"));

app.use("/admin", adminRouter);
app.use('/user', userRouter);

const startServer = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log("Server Running on port", PORT);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
