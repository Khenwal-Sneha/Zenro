// =====================
// IMPORTS
// =====================
require("dotenv").config();
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const cors = require("cors");
const methodOverride = require("method-override");

// SESSION + AUTH
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// MODELS
const User = require("./models/user");
const Listing = require("./models/listing");

// ROUTES
const listingsroute = require("./routes/listing");
const reviewsroute = require("./routes/review");
const usersroute = require("./routes/user");

// ERRORS
const ExpressError = require("./utils/ExpressError");
const asyncWrap = require("./utils/asyncWrap");
const handleCastError = require("./MongooseErr/CastError");

// =====================
// CORS (🔥 IMPORTANT)
// =====================
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// =====================
// MIDDLEWARES
// =====================
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// =====================
// DB CONNECTION
// =====================
const dburl = process.env.ATLASDB_URL;

mongoose.connect(dburl)
  .then(() => console.log("Mongo Connected"))
  .catch((err) => console.log("❌ DB Error:", err));
  
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: dburl,
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    },
  })
);

// =====================
// PASSPORT CONFIG
// =====================
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// =====================
// ROUTES
// =====================

// 👉 CURRENT USER (VERY IMPORTANT FOR REACT)
app.get("/api/current-user", (req, res) => {
  res.json({
    user: req.user || null,
  });
});

// 👉 CHECK USERNAME
app.get("/api/check-username", async (req, res) => {
  const { username } = req.query;

  try {
    const user = await User.findOne({ username });
    res.json({ exists: !!user });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// 👉 CHECK EMAIL
app.get(
  "/api/check-email",
  asyncWrap(async (req, res) => {
    const { email } = req.query;

    const user = await User.findOne({ email });
    res.json({ exists: !!user });
  })
);

// MAIN ROUTES
app.use("/", listingsroute);
app.use("/", usersroute);
app.use("/listings/:id/reviews", reviewsroute);

// =====================
// 404 HANDLER
// =====================
app.all("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Page Not Found",
  });
});

// =====================
// ERROR HANDLER
// =====================
app.use((err, req, res, next) => {
  if (err.name === "CastError") {
    handleCastError(err);
  }

  const { status = 500, message = "Something went wrong" } = err;

  res.status(status).json({
    success: false,
    message,
  });
});

// =====================
// SERVER
// =====================
app.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});