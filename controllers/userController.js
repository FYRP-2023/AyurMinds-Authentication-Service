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
};

module.exports = userController;
