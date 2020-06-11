const jwt = require("jsonwebtoken");
const { asyncHandler } = require("./async");
const ErrorResponse = require("../utils/ErrorResponse");
const { User } = require("../models/User");

//protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // else if (req.cookies.token) {
  //     token = req.cookies.token
  // }

  if (!token) {
    return next(new ErrorResponse(`Not authorized to access this route`, 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded);
    if (!decoded.id) {
      return next(
        new ErrorResponse(`Not authorized to access this route`, 401)
      );
    }
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return next(new ErrorResponse(`Not authorized to access this route`, 401));
  }
});

//authorize different user roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.type)) {
      return next(
        new ErrorResponse(
          `User type ${req.user.type} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
