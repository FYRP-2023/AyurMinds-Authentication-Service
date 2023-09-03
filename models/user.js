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
    gender: {
      type: String,
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
    languageId: {
      type: String,
      default: 1,
    },
    isDoctor: {
      type: Boolean,
      default: false,
    },
    doctor: {
      contactNo: String,
      isVerified: {
        type: Boolean,
        default: false,
      },
      specializedIn: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Disease",
        },
      ],
      verificationDocs: [
        {
          doc: String,
          isVerified: Boolean,
        },
      ],
      bio: String,
      ratings: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          rate: Number,
        },
      ],
      reviews: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          comment: String,
          sentiment: Object,
          diseases: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Disease",
            },
          ],
        },
      ],
      availablePlaces: [
        {
          name: String,
          cordinate: Object,
          timeSlots: [
            {
              daysType: String,
              from: String,
              to: String,
              isAvailable: Boolean,
            },
          ],
        },
      ],
    },
    isPharmacist: {
      type: Boolean,
      default: false,
    },
    pharmacist: {
      contactNo: String,
      isVerified: {
        type: Boolean,
        default: false,
      },
      verificationDocs: [
        {
          doc: String,
          isVerified: Boolean,
        },
      ],
      bio: String,
      ratings: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          rate: Number,
        },
      ],
      reviews: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          comment: String,
          sentiment: Object,
        },
      ],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
