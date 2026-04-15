const ExpressError = require("../utils/ExpressError");

function handleCastError(err){
       err.message="The Id is not Valid!";
       err.status=403;
       return err;
}

module.exports=handleCastError;