const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const checkLogin = require("../middleware/checkLogin");

const Post = mongoose.model("Post");
const User = mongoose.model("User");

router.get("/user/:userID", checkLogin, (req, res) => {
  User.findOne({ _id: req.params.userID })
    .select("-password")
    .then((user) => {
      Post.find({ author: req.params.userID })
        .populate("author", "_id name")
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error: err });
          }
          res.json({ user, posts });
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: "User not found" });
    });
});

router.put("/follow", checkLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.userID,
    {
      $push: { followers: req.user._id },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.userID },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          res.status(422).json({ error: err });
        });
    }
  );
});

router.put("/unfollow", checkLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.userID,
    {
      $pull: { followers: req.user._id },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.userID },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          res.status(422).json({ error: err });
        });
    }
  );
});

router.put("/updateavatar", checkLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { avatar: req.body.avatar } },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      res.json(result);
    }
  );
});

router.post("/searchusers", (req, res) => {
  let userPattern = new RegExp("^" + req.body.query, "i");
  User.find({ name: { $regex: userPattern } })
    .select("_id email name")
    .then((user) => {
      res.json({ user });
    })
    .catch((e) => {
      console.error(e);
    });
});

module.exports = router;
