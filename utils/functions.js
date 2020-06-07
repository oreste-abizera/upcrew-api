const { User } = require("../models/User");

exports.getUserUniqueness = async (user) => {
  let findEmail = await User.findOne({ userEmail: user.userEmail });
  if (findEmail) {
    return {
      unique: false,
      message: "Email already taken. Please try again with another email",
    };
  }

  let findUsername = await User.findOne({ userName: user.userName });
  if (findUsername) {
    return {
      unique: false,
      message: "Username already taken. Please try again with another Username",
    };
  }

  return {
    unique: true,
  };
};

exports.checkValidUser = async (userId) => {
  let user = await User.findById(userId);
  if (!user) {
    return {
      valid: false,
    };
  }

  return {
    valid: true,
    user: user,
  };
};
