const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      default: "no pic",
    },
    likes: [{ type: ObjectId, ref: "User" }],
    comments: [{ text: String, postedBy: { type: ObjectId, ref: "User" } }],
    author: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

mongoose.model("Post", postSchema);
