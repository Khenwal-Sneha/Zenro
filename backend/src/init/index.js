const mongoose=require("mongoose");
const initdata=require("./data.js");
async function main(){
    await mongoose.connect("mongodb://localhost:27017/LodgeLink");
}
main().then(()=>console.log("Connected Successfully!")).catch((err)=>console.log(err));
const Listing=require("../models/listing.js");

const initDB = async()=>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:'667fa24ddb5e6eba6a42aefd'}));
    await Listing.insertMany(initdata.data);
    console.log("data was initialised");
};

initDB();