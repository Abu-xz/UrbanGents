import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import morgan from 'morgan';
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

app.use(cookieParser());
app.use(
  session({
    secret: "xdv14nmjad",
    resave: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost:27017/session-db",
    }),
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: "lax", // Use 'none' for cross-origin, but remember to set 'secure: true' when using HTTPS
      secure: false, // Set to true if using HTTPS
    },
  })
);

// app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//serving static files js,css,images
app.use(express.static("public"));

app.use("/admin", adminRouter);
app.use("/user", userRouter);

const startServer = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log( `Server started \nUser route: http://localhost:5000/user/login \nAdmin route: http://localhost:5000/admin/login`)
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
