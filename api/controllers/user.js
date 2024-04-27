const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.user_signup = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "User created"
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
};

exports.user_login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).exec();

    if (!user) {
      return res.status(401).json({
        message: "Auth failed"
      });
    }
    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) {
      return res.status(401).json({
        message: "Auth failed"
      });
    }
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id
      },
      process.env.JWT_KEY,
      {
        expiresIn: "1h"
      }
    );
    // Update user document with token
    user.token = token;
    await user.save();

    return res.status(200).json({
      message: "Auth successful",
      token: token
    });
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).json({
      error: "Internal server error"
    });
  }
};

// exports.user_login = async (req, res, next) => {
//   try {
//     const user = await User.findOne({ email: req.body.email }).exec();

//     if (!user) {
//       return res.status(401).json({
//         message: "Auth failed"
//       });
//     }

//     const match = await bcrypt.compare(req.body.password, user.password);

//     if (match) {
//       const token = jwt.sign(
//         {
//           email: user.email,
//           userId: user._id
//         },
//         process.env.JWT_KEY,
//         {
//           expiresIn: "1h"
//         }
//       );

//       return res.status(200).json({
//         message: "Auth successful",
//         token: token
//       });
//     } else {
//       return res.status(401).json({
//         message: "Auth failed"
//       });
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       error: err
//     });
//   }
// };

exports.user_delete = (req, res, next) => {
  User.deleteOne({ _id: req.params.userId })
    .exec()
    .then(result => {
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "No valid entry found for provided ID" });
      }
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
