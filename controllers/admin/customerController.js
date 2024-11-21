import Users from "../../models/userModel.js";


 
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

//block & unblock user 
export const customerAction = async (req, res) => {
  try {
    console.log('customer action reached')
    const { action, userId } = req.params;
    console.log(action);
    const user = await Users.findById(userId);
    // console.log("hello",user.status)
    if (action === "block") {
      user.status = true 
      user.save();
      res.status(200).redirect("/admin/customers");
      return;
    } 
    else if (action === "unblock") {
      user.status = false
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
