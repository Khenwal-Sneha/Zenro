const Review = require("../models/review");
const Listing = require("../models/listing");

// Add a new review
module.exports.add = async (req, res, next) => {
    const { id } = req.params; // listing ID
    try {
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/"); // Redirect to homepage if listing not found
        }

        const { rating, comment } = req.body;

        // Create review
        const review = new Review({
            rating: Number(rating), // Ensure rating is a number
            comment,
            listing: listing._id,
            owner: req.user._id
        });

        await review.save();

        // Add review to the listing
        listing.reviews.unshift(review._id);
        await listing.save();

        req.flash("success", "Review added successfully!");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error("Error adding review:", err);
        req.flash("error", "Could not add review. Please try again.");
        res.redirect(`/listings/${id}`);
    }
};

// Delete a review
module.exports.delete = async (req, res, next) => {
    const { id, id2 } = req.params; // id = listing ID, id2 = review ID
    try {
        const review = await Review.findById(id2);

        if (!review) {
            req.flash("error", "Review not found!");
            return res.redirect(`/listings/${id}`);
        }

        // Only owner of the review can delete
        if (!req.user._id.equals(review.owner)) {
            req.flash("error", "You don't have permission to delete this review!");
            return res.redirect(`/listings/${id}`);
        }

        // Delete review
        await Review.findByIdAndDelete(id2);

        // Remove review reference from listing
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: id2 } });

        req.flash("success", "Review deleted successfully!");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error("Error deleting review:", err);
        req.flash("error", "Could not delete review. Please try again.");
        res.redirect(`/listings/${id}`);
    }
};