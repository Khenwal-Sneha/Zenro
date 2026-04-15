const User = require("../models/user");
const Listing = require("../models/listing");


// ======================
// SIGNUP
// ======================
module.exports.slogic = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    const newUser = new User({ name, email, username });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Login after signup failed",
        });
      }

      return res.status(201).json({
        success: true,
        message: "User created successfully",
        user: registeredUser,
      });
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Username or email already exists",
    });
  }
};

// ======================
// LOGIN
// ======================
module.exports.llogic = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome back!",
    user: req.user,
  });
};

// ======================
// LOGOUT
// ======================
module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Logout failed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  });
};

// ======================
// GET PROFILE (PUBLIC)
// ======================
module.exports.viewProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const listings = await Listing.find({ owner: user._id })
      .populate("owner");

    return res.status(200).json({
      success: true,
      user,
      listings,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ======================
// GET CURRENT USER PROFILE (VERY IMPORTANT)
// ======================
module.exports.getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(200).json({
        success: true,
        user: null,
        listings: [],
      });
    }

    const listings = await Listing.find({ owner: req.user._id });

    return res.status(200).json({
      success: true,
      user: req.user,
      listings,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

// ======================
// UPLOAD PROFILE PIC
// ======================
module.exports.upload = async (req, res) => {
  try {
    console.log("🔥 UPLOAD HIT");
    console.log("PARAMS:", req.params);
    console.log("FILE:", req.file);
    console.log("BODY:", req.body);

    const { username } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const url = req.file.path;
    const filename = req.file.filename;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.profile = { url, filename };
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile picture updated",
      url,
    });

  } catch (err) {
    console.log("🔥 FULL ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};