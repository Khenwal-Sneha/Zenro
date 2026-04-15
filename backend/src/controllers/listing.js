const Listing = require("../models/listing");

// =======================
// GET ALL LISTINGS
// =======================
module.exports.index = async (req, res) => {
  try {
    const listings = await Listing.find();

    return res.status(200).json({
      success: true,
      data: listings
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch listings"
    });
  }
};
// =======================
// GET SINGLE LISTING
// =======================
module.exports.show = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate({
        path: "reviews",
        populate: { path: "owner" }
      })
      .populate("owner");

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: listing
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// =======================
// CREATE LISTING
// =======================
module.exports.create = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Login required"
      });
    }
    console.log("USER:", req.user);
    const listing = new Listing(req.body);
    listing.owner = req.user._id;
    console.log("USER:", req.body);
    
    if (req.file) {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
      console.log("FILE:", req.file);
    }

    await listing.save();

    return res.status(201).json({
      success: true,
      data: listing
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// =======================
// UPDATE LISTING
// =======================
module.exports.update = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Not found"
      });
    }

    if (!req.user || !req.user._id.equals(listing.owner)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = {
        url: req.file.path,
        filename: req.file.filename
      };
    }

    const updated = await Listing.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      data: updated
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// =======================
// DELETE LISTING
// =======================
module.exports.delete = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Not found"
      });
    }

    if (!req.user || !req.user._id.equals(listing.owner)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    await Listing.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Deleted successfully"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

//for my listings
module.exports.profile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Login required"
      });
    }

    const user = req.user;

    const listings = await Listing.find({
      owner: user._id
    });

    return res.status(200).json({
      user,
      listings
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to load profile"
    });
  }
};