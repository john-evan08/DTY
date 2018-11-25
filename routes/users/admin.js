const express = require ('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../../config/database')

const User = require('../../models/user');
require('../../config/passport')(passport);

// AdminProfile


router.get('/userlist', (req, res, next) => {
    passport.authenticate('jwt', (err, user, info) => {
      if (user)
          // check user's role for premium or not
          if (user.admin){
            User.find({}, function(err, users) {
            res.json({success: true, msg: 'usersList displayed', users: users});});
          } else { 
               res.json({succes: false, msg: 'sorry you are not admin'});}
      else{
          // return items even if no authentication is present, instead of 401 response
              res.json({success: false, msg: 'not logged in'});
    }})(req, res, next);
  });
  
  router.delete('/userlist/:id', (req, res, next) => {
    passport.authenticate('jwt', (err, user, info) => {
      if (user)
          // check user's role for premium or not
          if (user.admin){
            User.findByIdAndRemove(req.params.id, function(err, doc){
            if(err) throw error;
            else {res.json({success: true, msg: 'user deleted'});}});
          } else { 
               res.json({success: false, msg: 'sorry you are not admin'});}
      else{
          // return items even if no authentication is present, instead of 401 response
              res.json({success: false, msg: 'not logged in'});
    }})(req, res, next);
  });
  
  router.put('/userlist/:id', (req, res, next) => {
    passport.authenticate('jwt', (err, user, info) => {
      if (user)
          // check user's role for premium or not
          if (user.admin){
            User.findByIdAndUpdate(req.params.id, {
               admin: true},
               function(err, doc){
            if(err) throw error;
            else {res.json({success: true, msg: 'user is now admin'});}});
          } else { 
               res.json({success: false, msg: 'sorry you are not admin'});}
      else{
          // return items even if no authentication is present, instead of 401 response
              res.json({success: false, msg: 'not logged in'});
    }})(req, res, next);
  });

  module.exports = router;

  