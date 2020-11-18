const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const checkLogin = require("../middleware/checkLogin");

const Post = mongoose.model("Post");

router.post("/createpost", checkLogin, (req, res) => {
  const { title, description, mediaUrl } = req.body;
  if (!title || !description) {
    return res.status(422).json({ error: "all fields are required" });
  }
  req.user.password = undefined;
  const post = new Post({
    title,
    photo: mediaUrl,
    description,
    author: req.user,
  });
  post
    .save()
    .then((postContent) => {
      res.json({ post: postContent });
    })
    .catch((e) => {
      console.error(e);
    });
});

router.get("/getallposts", checkLogin, (req, res) => {
  Post.find()
    .populate("author", "_id name displayname avatar")
    .populate("comments.postedBy", "_id name displayname avatar")
    .sort("-createdAt")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((e) => console.error(e));
});

router.get("/profile", checkLogin, (req, res) => {
  Post.find({ author: req.user._id })
    .populate("author", "_id name followers following")
    .then((mypost) => {
      res.json({ mypost });
    })
    .catch((e) => console.log(e));
});

router.put("/like", checkLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postID,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.status(201).json(result);
    }
  });
});

router.put("/dislike", checkLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postID,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.status(201).json(result);
    }
  });
});

router.put("/comment", checkLogin, (req, res) => {
  const comment = { text: req.body.text, postedBy: req.user._id };
  Post.findByIdAndUpdate(
    req.body.postID,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name avatar")
    .populate("author", "_id name")
    .exec((err, result) => {
      if (err) {
        console.log("error here");
        return res.status(422).json({ error: err });
      } else {
        return res.status(201).json(result);
      }
    });
});

router.delete("/delete/:postID", checkLogin, (req, res) => {
  Post.findOne({ _id: req.params.postID })
    .populate("author", "_id")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err });
      }
      if (post.author.id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            res.json(result);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
});

router.get("/postsforme", checkLogin, (req, res) => {
  Post.find({ author: { $in: req.user.following } })
    .populate("author", "_id name displayname avatar")
    .populate("comments.postedBy", "_id name displayname avatar")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((e) => console.error(e));
});

module.exports = router;
