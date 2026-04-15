const express = require("express");
const router = express.Router();
const passport = require("passport");

const userController = require("../controllers/user");
const asyncWrap = require("../utils/asyncWrap");
const { isLoggedin } = require("../isloggedin");
const multer = require("multer");
const { storage } = require("../cloudConfig"); // or wherever your cloudinary config is

const upload = multer({ storage });

// =====================
// AUTH
// =====================
router.post("/signup", asyncWrap(userController.slogic));

router.post(
  "/login",
  passport.authenticate("local"),
  userController.llogic
);

router.post("/logout", isLoggedin, userController.logout);

// =====================
// CURRENT USER
// =====================
router.get("/profile", isLoggedin, asyncWrap(userController.getMe));

// =====================
// PROFILE (PUBLIC)
// =====================
router.get("/profile/:username", asyncWrap(userController.viewProfile));

// =====================
// PROFILE PIC UPLOAD
// =====================
router.post(
  "/profile/:username/pfp",
  isLoggedin,
  upload.single('image'),
  asyncWrap(userController.upload)
);

module.exports = router;