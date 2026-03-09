// REQUIRING EXPRESS
const express = require("express");
const app = express();

// REQUIRING THINGS
  if (process.env.NODE_ENV!="production") {
     require("dotenv").config();
  }
// REQUIRING MODULES RELATED TO ERRORS
const ExpressError = require("./utils/ExpressError");
const asyncWrap = require("./utils/asyncWrap");
const handleCastError = require("./MongooseErr/CastError");

// REQUIRING MODELS
const User = require("./models/user");

// REQUIRING MIDDLEWARES
const cors = require("cors");
const methodOverride = require("method-override");
const path = require("path");
const ejsmate = require("ejs-mate");

// REQUIRING EXPRESS SESSION
const session = require("express-session");
const MongoStore = require('connect-mongo');

// REQUIRING PASSPORT AND LOCAL STRATEGY
const passport = require("passport");
const LocalStrategy = require("passport-local");

// REQUIRING CONNECT-FLASH
const flash = require("connect-flash");

//REQUIRING MULTER
const multer=require("multer");
const upload = multer({ dest: 'uploads/' });

// REQUIRING THE ROUTES
const listingsroute = require("./routes/listing");
const reviewsroute = require("./routes/review");
const usersroute = require("./routes/user");

// Middlewares
// REQUIRING AND USING CORS
app.use(cors());
// REQUIRING AND USING METHOD OVERRIDE
app.use(methodOverride('_method'));
// TO PARSE URL DATA
app.use(express.urlencoded({ extended: true }));
// TO PARSE JSON DATA
app.use(express.json());
// TO LINK STATIC FILES
app.use(express.static(path.join(__dirname, "public")));
// USING EJS AND JOINING PATH
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// USING EJSMATE
app.engine("ejs", ejsmate);

// CONNECTING TO DATABASE
const mongoose = require("mongoose");
const dburl=process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect(dburl);
}

main()
    .then(() => console.log("Connected Successfully!"))
    .catch((err) => {
        console.error("Error connecting to the database:", err);
    });


// USING EXPRESS SESSION
   //mongo session

const sessionOptions = {
    store: MongoStore.create({
        mongoUrl:dburl,
        crypto:{
            secret: process.env.SECRET
        },
        touchAfter:24*3600
      }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production' // Set to true in production
    }
};
app.use(session(sessionOptions));

// USING PASSPORT AND PASSPORT LOCAL STRATEGY
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// USING CONNECT-FLASH
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user; // To access the logged-in user in templates
    res.locals.redirectUrl = req.session.redirectUrl;
    next();
});

// ROUTES
// USING THE ROUTES
// FOR LISTINGS
app.use('/', listingsroute);

// FOR USERS
app.use('/', usersroute);

// FOR REVIEWS
app.use('/listings/:id/reviews', reviewsroute);

// ROUTE FOR CHECKING USERNAME EXISTENCE
app.get('/api/check-username', async (req, res) => {
    // USERNAME TO BE CHECKED IN DB
    const { username } = req.query;
    try {
        // CHECKING THE USER IN DB
        const user = await User.findOne({ username });
        res.json({ exists: !!user });
    } catch (err) {
        // IF ERROR EXISTS
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ROUTE FOR CHECKING EMAIL EXISTENCE
app.get('/api/check-email', asyncWrap(async (req, res, next) => {
    // EMAIL TO BE CHECKED IN DB
    const { email } = req.query;
    try {
        // CHECKING THE EMAIL IN DB
        const user = await User.findOne({ email: email });
        res.json({ exists: !!user });
    } catch (err) {
        // IF ERROR EXISTS
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));

// ERROR HANDLING MIDDLEWARES
app.all('*', (req, res, next) => {
    next(new ExpressError(404, "Page not Found!"));
});

app.use((err, req, res, next) => {
    if (err.name === "CastError") {
        handleCastError(err);
    }
    next(err);
});

app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("listings/error.ejs", { err });
});

app.listen(8080, () => {
    console.log("App running...");
});
