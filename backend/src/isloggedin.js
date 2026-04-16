module.exports.isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: "You must be logged in",
        redirectUrl: req.originalUrl, // optional (frontend can use)
      });
    }
  
    next();
  };