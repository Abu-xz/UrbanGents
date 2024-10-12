//signup management

export const loadSignup = (req, res) => {
  res.status(200).render("user/userSignup");
};

export const userSignup = (req, res) => {
  const { firstName, lastName, email, phoneNumber, password } = req.body;
  req.session.tempData = {
    firstName,
    lastName,
    email,
    phoneNumber,
    password
  };
  res.status(200).redirect("/user/createOtp");
};

export const createOtp = (req, res) => {
    
}
