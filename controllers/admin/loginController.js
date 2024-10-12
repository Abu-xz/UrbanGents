//admin login management
const adminEmail = process.env.EMAIL;
const adminPassword = process.env.PASSWORD;

export const adminLogin = (req, res) => {
  res.status(200).render("admin/adminLogin");
};

export const isValidAdmin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  if (email === adminEmail && password === adminPassword) {
    return res.status(200).redirect("/admin/dashboard"); // balance create dashboard route
  }
  return res.status(401).json({ error: "Invalid credentials" });
};
