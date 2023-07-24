const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const createToken = require("../helpers/createToken");
const logger = require("../helpers/appLogger");
const mongoRepository = require("../database/mongoRepository");
const { default: isEmail } = require("validator/lib/isemail");

const userController = {
  register: async (req, res) => {
    try {
      const { firstName, lastName, email, password, role } = req.body;

      // check fields
      if (!email || !password || !role || !firstName || !lastName)
        return res.status(400).json({ msg: "Please fill in all fields." });

      // check email
      if (!isEmail(email))
        return res
          .status(400)
          .json({ msg: "Please enter a valid email address." });

      // check user
      const props = { email };
      const user = await mongoRepository.user.findOne(props);
      if (user)
        return res
          .status(400)
          .json({ msg: "This email is already registered in our system." });

      // check password
      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Password must be at least 6 characters." });

      // hash password
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashPassword,
        role,
      });

      await mongoRepository.user.add(newUser);


      // Log an event
      logger.info("Event occurred: User added" + " " + email);
      // registration success
      res
        .status(200)
        .json({ msg: "Registration completed, you can now sign in." });
    } catch (error) {
      // Log an error
      logger.error(error);
      res.status(500).json({ msg: error.message });
    }
  },
  signing: async (req, res) => {
    try {
      // get cred
      const { email, password } = req.body;

      // check email
      const user = await mongoRepository.user.findOne({ email: email });
      if (!user)
        return res
          .status(400)
          .json({ msg: "This email is not registered in our system." });

      // check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ msg: "This password is incorrect." });

      // refresh token
      const rf_token = createToken.refresh({ id: user._id });
      const cookieSameSite = process.env.NODE_ENV === "production" ? "none" : "strict";
      res.cookie("_apprftoken", rf_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: cookieSameSite,
        maxAge: 24 * 60 * 60 * 1000, // 24h
      });
      // signing success
      res.status(200).json({ msg: "Signing success" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  access: async (req, res) => {
    try {
      // rf token
      const rf_token = req.cookies._apprftoken;
      if (!rf_token) return res.status(400).json({ msg: "Please sign in." });

      // validate
      jwt.verify(rf_token, process.env.REFRESH_TOKEN, (err, user) => {
        if (err) return res.status(400).json({ msg: "Please sign in again." });
        // create access token
        const ac_token = createToken.access({ id: user.id });
        // access success
        return res.status(200).json({ ac_token });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  signout: async (req, res) => {
    try {
      // clear cookie
      res.clearCookie("_apprftoken");
      //change the access token
      createToken.access({ id: "abc0" });
      createToken.refresh({ id: "abc0" });
      // success
      res.status(200).json({ msg: "Signout success." });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = userController;
