export const adminAuth = (req, res, next) => {
    if(req.session.admin){
        next();
    }else{
        res.status(401).redirect('/admin/login')
    }
}