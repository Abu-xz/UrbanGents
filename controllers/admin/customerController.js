import Users from "../../models/userModel.js";

//dashboard routes
export const loadDashboard = (req, res) => {
  if (!req.session.admin) {
    return res.status(401).redirect('/admin/login'); 
  }
  res.render('admin/dashboard'); 
};

// customer management
export const loadCustomer = async (req, res) => {
  try {
    const users = await Users.find();
    if (users) {
      res.status(200).render("admin/customers", { users });
    }
  } catch (error) {
    console.log(error);
  }
};

export const customerAction = async (req, res) => {
  try {
    console.log('customer action reached')
    const { action, userId } = req.params;
    // console.log(action, userId);
    const user = await Users.findById(userId);
    // console.log("hello",user.status)
    if (action === "block") {
      user.status = false;
      user.save();
      res.status(200).redirect("/admin/customers");
      return;
    } else if (action === "unblock") {
      user.status = true;
      user.save();
      res.status(200).redirect('/admin/customers');
      return;
    } else {
      res.status(500).redirect("/admin/customers");
      return;
    }
  } catch (error) {
    console.log(error);
  }
};
