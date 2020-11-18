const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const {
  DEFAULT_AVATAR,
} = require("../keys");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  displayname: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: DEFAULT_AVATAR,
  },
  followers: [{ type: ObjectId, ref: "User" }],
  following: [{ type: ObjectId, ref: "User" }],
  resetToken: String,
  expireToken: Date,
});

mongoose.model("User", userSchema);
