import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import connectDb from "./utils/db.js";
import adminRouter from "./routes/adminRoute.js";
import userRouter from "./routes/userRoute.js";
import passport from "passport";
import Users from "./models/userModel.js";
import pkg from "passport-google-oauth20";
import { isUser } from "./middleware/userAuth.js";
import Product from "./models/productModel.js";

const { Strategy: GoogleStrategy } = pkg;

const app = express();

dotenv.config();

const PORT = process.env.PORT || 3000;

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//view engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Session and cookie setup
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost:27017/session-db",
    }),
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      // Use 'none' for cross-origin, but remember to set 'secure: true' when using HTTPS
      secure: false, // Set to true if using HTTPS
    },
  })
);

//Google authentication
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await Users.findOne({ googleId: profile.id });
        if (user) {
          return done(null, user);
        } else {
          user = new Users({
            googleId: profile.id,
            email: profile.emails[0].value,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            displayName: profile.displayName,
            photo: profile.photos[0].value,
            status: false,
          });
          await user.save();
          return done(null, user);
        }
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get(
  "/auth/google", isUser,
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

app.get(
  "/auth/google/callback", isUser,
  passport.authenticate("google", { failureRedirect: "/user/login" }),
  (req, res) => {
    req.session.user = req.user.googleId;
    res.redirect("/user/home");
  }
);

// app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//serving static files js,css,images
app.use(express.static("public"));

app.get("/", isUser, async (req, res) => {
  try {
    const product = await Product.find({
      isActive: true,
      isDeleted: false,
    }).limit(8);
    const spotlight = await Product.find({
      isActive: true,
      isDeleted: false,
    }).limit(3);
    res.status(200).render("user/landing", { product, spotlight });
  } catch (error) {
    res.status(500).json({message:'Internal server error!'});
  }
});

app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use((req ,res) => {
  res.status(200).render('partials/404')
})

const startServer = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(
        `Server started \nUser: https://urbangents.store \nAdmin: https://urbangents.store/admin/login`
      );
    });
  } catch (error) {
    console.log(error.message);
  }
};

startServer();
