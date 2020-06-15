const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, "add subject"],
  },
  body: {
    type: String,
    required: [true, "add content of the message"],
  },
  to: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "add message recipient"],
  },
  from: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "add sender"],
  },
  sentAt: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: String,
    enum: ["unread", "read"],
    default: "unread",
  },
});

module.exports.Message = mongoose.model("Message", MessageSchema);
