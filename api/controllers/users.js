const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.create_user = (req,res,next) => {
  User.find({email: req.body.email})
    .exec()
    .then(user => {
      if(user.length >= 1){
        return res.status(409).json({
          message: 'Email exists'
        });
      } else {
        //Function to hash user password before creating new User
        bcrypt.hash(req.body.password, 10, (err,hash) => {
          if(err){
            res.status(500).json({error: err.message});
          }else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user.save()
              .then(result => res.status(200).json({
                message: 'User created'
              }))
              .catch(err => res.status(500).json({error: err.message}))
          }
        });
      }
    });
};
exports.login_user = (req,res,next) => {
  User.find({email: req.body.email})
    .exec()
    .then(user => {
      if(user.length < 1) {
        return res.status(401).json({message: 'Authorization Failed'});
      }
      bcrypt.compare(req.body.password, user[0], (err,result) => {
          if(err) {
            return res.status(500).json({error: err.message});
          };
          if(result){
            const token = jwt.sign({
              email: user[0].email,
              userId: user[0]._id
            }, process.end.JWT_KEY, {
              expiresIn: "1h"
            });
            return res.status(200).json({
              message: "Authorization Successful",
              token: token
            });
          }
          res.status(401).json({message: 'Authorization Failed'});
        });
    })
    .catch(err => {
      res.status(500).json({error: err});
    });
};
exports.delete_user = (req,res,next) => {
  User.remove({_id: req.params.userId)})
    .exec()
    .then(user => {
      res.status(200).json({message: 'User deleted'});
    })
    .catch(err => {
      res.status(500).json({
        error: err.message
      });
    })
}
