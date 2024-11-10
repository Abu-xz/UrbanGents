import Users from "../models/userModel.js";

export const userAuth = async (req, res, next) => {
  if (req.session.user) {
    const userData = req.session.user?.email || req.session.user;
    const user = await Users.findOne({
      $or: [{ email: userData }, { googleId: userData }],
    });
    console.log(user.status)
    if(user.status)
      {
        req.session.user= null
        return res.status(403).redirect('/user/login');
      } 
    next();
  } else {
    res.status(401).redirect("/user/login");
  }
};

export const isUser = async (req, res, next) => {
  if (req.session.user) {
    res.redirect("/user/home");
  } else {
    next();
  }
};
