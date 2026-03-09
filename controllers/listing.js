const Listing=require("../models/listing");
//Index Route
module.exports.index=async (req, res , next) => {
    let alllistings = await Listing.find();
    res.render("listings/index.ejs", { alllistings });  
}

//New Form
module.exports.newForm=(req,res)=>{
    res.render("listings/new.ejs")
}

// Show Route
module.exports.show=async (req, res, next) => {
    const { id } = req.params;
    // Find listing by id and populate reviews and their owners
    const listing = await Listing.findById(id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'owner'
            }
        }).populate('owner');
    res.render("listings/show.ejs", { listing });
}

//create route

module.exports.create = async (req, res, next) => {
    try {
        // Check if currentUser is defined
        if (!req.user) {
            req.flash('error', 'You must be signed in to create a listing.');
            return res.redirect('/login');
        }

        // Ensure files are uploaded correctly
        if (!req.file) {
            req.flash('error', 'Please upload at least one image.');
            return res.redirect('/listings/new');
        }

        const listing = new Listing(req.body);
        listing.owner = req.user._id;

        // Process uploaded files (ensure they exist and have URLs)
            if (!req.file.path || !req.file.filename) {
                req.flash('error', 'Image upload failed. Please try again.');
                return res.redirect('/listings/new');
            }
        listing.image= { url: req.file.path, filename: req.file.filename };

        await listing.save();
        req.flash('success', 'Successfully created a new listing!');
        res.redirect(`/listings/${listing._id}`);
    } catch (e) {
        console.error(e);
        // req.flash('error', 'Something went wrong. Please try again.');
        res.redirect('/listings/new');
    }
};

//edit route
module.exports.edit=async (req, res, next) => {
    const { id } = req.params;
    const editlist = await Listing.findById(id);
    const originalURL=editlist.image.url;
    const newURL=originalURL.replace("/upload","/upload/w_250");
    if (editlist && req.user._id.equals(editlist.owner)) {
        res.render("listings/edit.ejs", { editlist , newURL });
    } else {
        req.flash("error", "You cannot edit this listing!");
        res.redirect(`/listings/${id}`);
    }
}

module.exports.update = async (req, res, next) => {
    const { id } = req.params;
    const { title, description, price, location, country } = req.body;
    
    try {
      const listing = await Listing.findById(id);
      if (!listing) {
        req.flash('error', 'Listing not found!');
        return res.redirect('/');
      }
    
      // Check if the current user is the owner of the listing
      if (!req.user._id.equals(listing.owner)) {
        req.flash("error", "You cannot edit this listing!");
        return res.redirect(`/listings/${id}`);
      }
    
      // Prepare update data
      const updateData = { title, description, price, location, country };
      if (req.file) {
        updateData.image = { url: req.file.path, filename: req.file.filename };
      } else {
        updateData.image = { url: listing.image.url, filename: listing.image.filename };
      }
    
      // Update the listing
      await Listing.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    
      req.flash('success', 'Listing updated successfully!');
      res.redirect(`/listings/${id}`);
    } catch (error) {
      console.error(error);
      req.flash('error', 'Something went wrong!');
      res.redirect(`/listings/${id}`);
    }
  };
  

//delete route
module.exports.delete=async (req,res,next)=>{
    const {id}=req.params;
    const dltlisting = await Listing.findById(id);
    if(dltlisting && req.user._id.equals(dltlisting.owner)){
        await Listing.findByIdAndDelete(id);
        req.flash("success","Your Listing was deleted!");
        res.redirect("/");
    }else{
        req.flash("error","You cannot delete this listing!");
        res.redirect(`/listings/${id}`);
    }
}