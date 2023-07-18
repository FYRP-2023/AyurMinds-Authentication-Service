const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "doctor", "pharmacist", "admin", "super_admin"],
      default: "user",
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dzhhvabny/image/upload/v1689611678/default_avatar/default-avatar.jpg",
    },
    contactNo: {
      type: String,
    },
    languageId:{
      type:String,
      default:1
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
