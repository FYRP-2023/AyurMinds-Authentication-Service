const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    user:{
      
    },
    isVerified: { type: Number, default: 0, enum: [0,1,2] }, //0:not verified 1: pending , 2:verified
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
