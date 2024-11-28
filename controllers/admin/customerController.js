import Users from "../../models/userModel.js";

// customer management
export const loadCustomer = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 7;
    const skip = (page - 1) * limit;
    const totalUsers = await Users.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);
    const users = await Users.find().skip(skip).limit(limit);
    if(users.length === 0) {
      return res.status(404).render('admin/customers');
    }
    if (page > totalPages) {
      return res.status(200).redirect(`/admin/customers?page=${totalPages}`);
    }
    res.status(200).render("admin/customers", { users, totalPages, page });
  } catch (error) {
    res.status(500).render('admin/customers')
  }
};

//block & unblock user
export const customerAction = async (req, res) => {
  try {
    const { action, userId } = req.params;
    const user = await Users.findById(userId);
    if (action === "block") {
      user.status = true;
      user.save();
      res.status(200).redirect("/admin/customers");
      return;
    } else if (action === "unblock") {
      user.status = false;
      user.save();
      res.status(200).redirect("/admin/customers");
      return;
    } else {
      res.status(500).redirect("/admin/customers");
      return;
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
