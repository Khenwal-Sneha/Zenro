const Review = require("../models/review");
const Listing = require("../models/listing");

// =======================
// ADD REVIEW
// =======================
module.exports.add = async (req, res) => {
  const { id } = req.params;

  try {
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    const { rating, comment } = req.body;

    const review = new Review({
      rating: Number(rating),
      comment,
      listing: listing._id,
      owner: req.user._id,
    });

    await review.save();

    listing.reviews.unshift(review._id);
    await listing.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review,
    });

  } catch (err) {
    console.error("Error adding review:", err);

    res.status(500).json({
      success: false,
      message: "Could not add review",
      error: err.message,
    });
  }
};


// =======================
// DELETE REVIEW
// =======================
module.exports.delete = async (req, res) => {
  const { id, id2 } = req.params;

  try {
    const review = await Review.findById(id2);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (!req.user || !req.user._id.equals(review.owner)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await Review.findByIdAndDelete(id2);

    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: id2 },
    });

    res.json({
      success: true,
      message: "Review deleted successfully",
    });

  } catch (err) {
    console.error("Error deleting review:", err);

    res.status(500).json({
      success: false,
      message: "Could not delete review",
      error: err.message,
    });
  }
};