const User = require("../models/user");
const Listing = require("../models/listing");

// Signup form
module.exports.signup = (req, res) => {
    res.render("user/signup.ejs");
};

// Signup logic
module.exports.slogic = async (req, res, next) => {
    try {
        const { name, email, username, password } = req.body;
        const newUser = new User({ name, email, username });
        const registeredUser = await User.register(newUser, password);

        // Automatically log in after signup
        req.login(registeredUser, (err) => {
            if (err) {
                req.flash("error", "Problem logging in!");
                return res.redirect("/");
            }
            req.flash("success", "Welcome to LodgeLink!");
            res.redirect("/");
        });
    } catch (err) {
        console.error(err);
        req.flash("error", "Username or email already exists!");
        res.redirect("/signup");
    }
};

// Login form
module.exports.login = (req, res) => {
    res.render("user/login.ejs");
};

// Login logic
module.exports.llogic = (req, res) => {
    const redirectUrl = res.locals.redirectUrl || "/";
    delete req.session.redirectUrl; // Clear redirect session
    req.flash("success", "Welcome back!");
    res.redirect(redirectUrl);
};

// Logout logic
module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            req.flash("error", "Logout failed, try again!");
            return res.redirect("/");
        }
        req.flash("success", "You are logged out!");
        res.redirect("/");
    });
};

// View own profile
module.exports.viewProfile = async (req, res, next) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });
        if (!user) {
            req.flash("error", "User not found");
            return res.redirect("/");
        }

        // Find listings owned by this user
        const listings = await Listing.find({ owner: user._id });

        res.render("user/profile", { user, listings });
    } catch (err) {
        next(err);
    }
};

// Render upload profile picture form
module.exports.renderUploadForm = (req, res) => {
    res.render("user/upload", { username: req.params.username });
};

// Handle profile picture upload
module.exports.upload = async (req, res, next) => {
    try {
        const { username } = req.params;

        if (!req.file) {
            req.flash("error", "No file uploaded!");
            return res.redirect(`/${username}/pfp`);
        }

        const url = req.file.path;
        const filename = req.file.filename;

        const user = await User.findOne({ username });
        if (!user) {
            req.flash("error", "User not found");
            return res.redirect("/");
        }

        user.profile = { url, filename };
        await user.save();

        req.flash("success", "Profile picture updated!");
        res.redirect(`/${username}`);
    } catch (err) {
        console.error("Error uploading profile picture:", err);
        req.flash("error", "Something went wrong while uploading your image.");
        res.redirect(`/${req.params.username}/pfp`);
    }
};

// User info page (public view)
module.exports.info = async (req, res, next) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });
        if (!user) {
            req.flash("error", "User not found");
            return res.redirect("/");
        }

        const listings = await Listing.find({ owner: user._id }).populate("owner");

        // If viewing own profile, render profile page
        if (req.user && user._id.equals(req.user._id)) {
            return res.render("user/profile", { user, listings });
        }

        // Public info view
        res.render("user/info", { user, listings });
    } catch (err) {
        next(err);
    }
};