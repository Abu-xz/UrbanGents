import Users from "../models/userModel.js";

export const userAuth = async (req, res, next) => {
  try {
    if (req.session.user) {
      const userData = req.session.user?.email || req.session.user;
      const user = await Users.findOne({
        $or: [{ email: userData }, { googleId: userData }],
      });

      if (!user) {
        req.session.user = null; 
        return res.redirect("/user/login");
      }
      // Handle blocked or inactive user
      if (user.status || user.status === "undefined") {
        req.session.user = null; 
        return res.redirect("/user/login");
      }

      next(); 
    } else {
      res.redirect("/user/login"); // User not logged in
    }
  } catch (error) {
    console.error("Error in userAuth middleware:", error);
    res.status(500).send("Internal Server Error");
  }
};


export const isUser = async (req, res, next) => {
  if (req.session.user) {
    res.redirect("/user/home");
  } else {
    next();
  }
};
