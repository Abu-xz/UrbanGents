//admin login management
const adminEmail = process.env.EMAIL;
const adminPassword = process.env.PASSWORD;

export const loadLogin = (req, res) => {
  if(req.session.admin){
    return res.redirect('/admin/dashboard')
  }else{

  }
  res.status(200).render("admin/login");
};

export const isValidAdmin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  if (email === adminEmail && password === adminPassword) {
    req.session.admin ={email}

    return res.status(200).redirect("/admin/dashboard"); // balance create dashboard route
  }
  return res.status(401).json({ error: "Invalid credentials" });
};


export const logout = (req, res) => {
  
  req.session.destroy(err => {
    if(err){
      console.log('Error logging out')
    }
    res.clearCookie('connect.sid');
    res.redirect('/admin/login')
  })
}

