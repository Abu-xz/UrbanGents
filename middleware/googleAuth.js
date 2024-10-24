export const googleAuth = (req ,res) => {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/user/login');
}


export const isGoogleAuth = async (req, res) => {
    if(req.isAuthenticated()){
        return res.redirect('/user/home')
    };
    next();
}