const { asyncHandler } = require("../middlewares/async");
const ErrorResponse = require("../utils/ErrorResponse");
const { Message } = require("../models/Message");

// @desc                getting all messages
//@route                GET /api/v1/messages
// @access              private route
exports.getMessages = asyncHandler(async (req, res, next) => {
  let to = await Message.find({ to: req.user._id });
  let from = await Message.find({ from: req.user._id });
  let messages = [...to, ...from];
  if (!messages) {
    return next(new ErrorResponse("no messages found", 404));
  }
  res.json({
    success: true,
    count: messages.length,
    data: messages,
  });
});

// @desc                getting single message
//@route                GET /api/v1/messages/:id
// @access              private route
exports.getSingleMessage = asyncHandler(async (req, res, next) => {
  let message = await Message.findById(req.params.id);
  if (!message) {
    return next(
      new ErrorResponse(`no message found with id of ${req.params.id}`, 404)
    );
  }
  if (
    message.to.toString() !== req.user._id.toString() &&
    message.from.toString() !== req.user._id.toString()
  ) {
    return next(new ErrorResponse(`Access denied`, 403));
  }
  res.json({
    success: true,
    count: message.length,
    data: message,
  });
});

// @desc                posting message
//@route                POST /api/v1/messages
// @access              private route
exports.createMessage = asyncHandler(async (req, res, next) => {
  const messageData = { ...req.body, from: req.user._id };
  let createdMessage = await Message.create(messageData);
  res.json({
    success: true,
    data: createdMessage,
  });
});

// @desc                editing message
//@route                PUT /api/v1/messages/:id
// @access              private route
exports.editMessage = asyncHandler(async (req, res, next) => {
  let editedMessage = await Message.findById(req.params.id);
  if (!editedMessage) {
    return next(
      new ErrorResponse(`message with id of ${req.params.id} not found`),
      404
    );
  }
  if (
    editedMessage.from.toString() !== req.user._id.toString() &&
    editedMessage.to.toString() !== req.user._id.toString()
  ) {
    return next(new ErrorResponse("Access denied", 403));
  }

  //don't update status when message is seen by the sender
  let finalData;
  const { status, ...rest } = req.body;
  if (editedMessage.from.toString() === req.user._id.toString()) {
    finalData = { ...rest };
  } else {
    finalData = { ...req.body };
  }
  editedMessage = await Message.findByIdAndUpdate(req.params.id, finalData, {
    new: true,
    runValidators: true,
  });
  res.json({
    success: true,
    data: editedMessage,
  });
});

// @desc                deleting message
//@route                DELETE /api/v1/messages/:id
// @access              private route
exports.deleteMessage = asyncHandler(async (req, res, next) => {
  let deletedMessage = await Message.findById(req.params.id);
  if (!deletedMessage) {
    return next(
      new ErrorResponse(`message with id of ${req.params.id} not found`),
      404
    );
  }
  if (deletedMessage.from.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse("Access denied", 403));
  }
  deletedMessage.remove();
  res.json({
    success: true,
    data: {},
  });
});
