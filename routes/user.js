const express = require("express");
const router = express.Router();
const passport = require("passport");
const multer = require('multer');
const { storage } = require('../cloudConfig');
const upload = multer({ storage });

const userController = require("../controllers/user");
const asyncWrap = require("../utils/asyncWrap");
const { saveRedirectURL, isLoggedin } = require("../isloggedin");

// Signup routes
router.route("/signup")
    .get(userController.signup) // Render signup form
    .post(asyncWrap(userController.slogic)); // Handle signup logic

// Login routes
router.route("/login")
    .get(userController.login) // Render login form
    .post(saveRedirectURL, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.llogic); // Handle login logic

// Logout route
router.route("/logout")
    .get(isLoggedin, userController.logout); // Handle logout

// Profile picture upload routes
router.route("/:username/pfp")
    .get(isLoggedin, userController.renderUploadForm)
    .post(isLoggedin, (req, res, next) => {
        upload.single('img')(req, res, function(err) {
            if (err) {
                console.error("Multer / Cloudinary error:", err);
                req.flash("error", "Image upload failed! Please try again.");
                return res.redirect(`/${req.params.username}/pfp`);
            }
            next(); // proceed to asyncWrap(userController.upload)
        });
    }, asyncWrap(userController.upload)); // ✅ pass function, not string

// User info route
router.get("/:username/info", asyncWrap(userController.info));

// User profile route
router.route("/:username")
    .get(isLoggedin, asyncWrap(userController.viewProfile)); // Render user profile

module.exports = router;
