//admin login management
const adminEmail = process.env.EMAIL;
const adminPassword = process.env.PASSWORD;

export const loadLogin = (req, res) => {
  if (req.session.admin) {
    return res.redirect("/admin/dashboard");
  }
  res.status(200).render("admin/login", { success: true, message: null });
};

export const isValidAdmin = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .render("admin/login", {
        success: false,
        message: "Email and Password required",
      });
  }

  if (email === adminEmail && password === adminPassword) {
    req.session.admin = { email };
    return res.status(200).redirect("/admin/dashboard"); // balance create dashboard route
  }

  return res
    .status(401)
    .render("admin/login", { success: false, message: "Invalid Credential" });
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ message: err.message });
    }
    res.clearCookie("connect.sid");
    res.redirect("/admin/login");
  });
};
