const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

// Define default profile picture
const defaultProfilePicture = {
    filename:  'Lodgelink_dev/mc6talbwcyyxnq6ondct',
    url: 'https://res.cloudinary.com/dukmefdko/image/upload/v1720171494/Lodgelink_dev/mc6talbwcyyxnq6ondct.png' // Replace with your default profile picture URL
};

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true // Ensuring email is unique
    },
    name: {
        type: String,
        required: true
    },
    profile: {
        filename: {
            type: String,
            default: defaultProfilePicture.filename
        },
        url: {
            type: String,
            default: defaultProfilePicture.url
        }
    }
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;
