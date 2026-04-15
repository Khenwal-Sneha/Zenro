module.exports.isLoggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to LodgeLink!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectURL = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
        delete req.session.redirectUrl;
    }
    next();
}

// module.exports.isOwner=(req,res,next)=>{
//     if(req.isAuthenticated()){
        
//     }
// }