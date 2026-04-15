const mongoose=require("mongoose");

const reviewSchema = mongoose.Schema({
    rating:{
        type:Number,
        min:1,
        max:5,
        required:true
    },
    comment:{
        type:String
    },
    listing:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Listing"
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
});

const Review=new mongoose.model("Review",reviewSchema);
module.exports=Review;