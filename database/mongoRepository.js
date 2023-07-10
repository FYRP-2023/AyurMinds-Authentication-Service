const User = require("../models/user");

const mongoRepository = {
  user: {
    add: (props) => {
      return props.save();
    },
    findOne: (props) => {
      return User.findOne(props);
    },
    findById:(id)=>{
        return User.findById(id);
    },
    findByIdWithoutPassword:(id)=>{
        return User.findById(id).select("-password");
    }
  },
};

module.exports = mongoRepository;