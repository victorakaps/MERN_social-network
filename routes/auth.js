const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const checkLogin = require("../middleware/checkLogin");

const nodemailer = require("nodemailer");

const { JWT_SECRET, SENDER_EMAIL, EMAIIL_PASS } = require("../keys");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: SENDER_EMAIL,
    pass: EMAIIL_PASS,
  },
});

router.post("/signup", (req, res) => {
  const { name, displayname, password, email, avatar } = req.body;
  if (!email || !password || !name || !displayname) {
    return res.status(422).json({ error: "Invalid Input" });
  }
  User.findOne({ email: email })
    .then((existedUser) => {
      if (existedUser) {
        return res.status(400).json({ error: "email aleady registered" });
      }
      bcrypt
        .hash(password, 8)
        .then((hashedpass) => {
          const user = new User({
            name,
            displayname,
            email,
            password: hashedpass,
            avatar,
          });
          user
            .save()
            .then((user) => {
              transporter.sendMail({
                from: `"The Scuti's 42" <${SENDER_EMAIL}>`,
                to: email,
                subject: "Welcome to the scuti's 42 ",
                html: `<h3>Hey, ${name}</h3><p>You are receiving this because this email was signed up on scuti social network`,
              });
              res.json({ message: "user signed up successfully" });
            })
            .catch((e) => console.error(e));
        })
        .catch((e) => console.error(e));
    })
    .catch((e) => console.error(e));
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Email or Password is Missing" });
  }
  User.findOne({ email: email }).then((existedUser) => {
    if (!existedUser) {
      return res.status(422).json({ error: "Invalid Email Or Password" });
    }
    bcrypt
      .compare(password, existedUser.password)
      .then((passMatched) => {
        if (passMatched) {
          const token = jwt.sign({ _id: existedUser._id }, JWT_SECRET);
          const {
            _id,
            name,
            email,
            followers,
            following,
            avatar,
          } = existedUser;
          res.json({
            token,
            user: { _id, name, email, followers, following, avatar },
          });
        } else {
          return res.status(401).json({ error: "Invalid Email Or Password" });
        }
      })
      .catch((e) => {
        console.error(e);
      });
  });
});

router.post("/resetpassword", (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.error(err);
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        return res.status(422).json({ error: "user not available" });
      }
      user.resetToken = token;
      user.expireToken = Date.now() + 3600000;
      user.save().then((result) => {
        transporter.sendMail({
          from: `"The Scuti's 42" <${SENDER_EMAIL}>`,
          to: user.email,
          subject: "Reset Password",
          html: `<h3>Hey, ${user.name}</h3>
          <p>You are receiving this email beacuse you requested to change your password.
          if so,</p><a href="https://scuit-social-network.herokuapp.com/resetpassword/${token}">Click Here to reset your password</a>
          <p>(This link is only valid for 1 hour.)</p>
          <p>Ignore this email if you didn't requested forgot passwod.</p>
          `,
        });
        res.json({ message: "Check your email" });
      });
    });
  });
});

router.post("/newpassword", (req, res) => {
  const { newPass, authToken } = req.body;
  User.findOne({
    resetToken: authToken,
    expireToken: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        return res
          .status(422)
          .json({ error: "Unable To Process Request, Try Again" });
      }
      bcrypt.hash(newPass, 10).then((hashedpass) => {
        user.password = hashedpass;
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.save().then((savedUser) => {
          res.json({ message: "Password Updated, Login To Continue" });
        });
      });
    })
    .catch((err) => {
      console.error(err);
    });
});

module.exports = router;
