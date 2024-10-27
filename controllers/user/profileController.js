import Users from "../../models/userModel.js";

export const loadProfile = async (req, res) => {
  try {
    let user;
    const data = req.session?.user?.email || req.session?.user;
    // console.log("data here", data);
    if (req.session.user.email) {
      user = await Users.findOne({ email: data });
      //   console.log("normal user :", user);
    } else if (req.session.user) {
      user = await Users.findOne({ googleId: data });
      //   console.log("google User  :", user);
    }

    if (!user) {
      return res.status(500).render("user/userHome", { success: false});
    }
    console.log(user);
    
    const successMessage = req.session.successMessage;
    const errorMessage = req.session.errorMessage;

    res.status(200).render("user/profile", { user , successMessage, errorMessage});
    // clear session message after rendering
    req.session.successMessage = null;
    req.session.errorMessage = null;


  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: 'Error , user profile can"t access' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    // console.log('update profile route reached');
    const email = req.query.email;
    // console.log(email);
    const { firstName, lastName, phoneNumber } = req.body;
    // console.log(firstName, lastName, phoneNumber);

    if (!firstName || !lastName || !phoneNumber) {
      return res
        .status(400)
        .json({ success: false, message: "All field are required!" });
    } else {
      const updatedUser = await Users.findOneAndUpdate(
        { email: email },
        { firstName, lastName, phoneNumber }
      );
      await updatedUser.save();
      // console.log(updatedUser);
      req.flash("success", "Profile updates successfully!");
      return res.status(200).redirect("/user/profile");
    }
  } catch (error) {
    console.log("Error", error);
    req.flash("error", "Failed to update profile. Please try again.");
    res.redirect("/user/profile");
  }
};
