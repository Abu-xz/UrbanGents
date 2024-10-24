
export const userAuth = async (req, res, next)=> {
    if(req.session.user){
        next();
    }else{
        res.status(401).redirect('/user/login')
    }
};

export const isUser = async (req, res, next) =>{
    if(req.session.user){
        res.redirect('/user/home');
    }else{
        next()
    }
}