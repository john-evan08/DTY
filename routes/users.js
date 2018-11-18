const express = require ('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database')

const User = require('../models/user');
require('../config/passport')(passport);

//Register
router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        admin: false,
        bills: []
        
    });

    User.addUser(newUser, (err, user) => {
        if(err){
            res.json({success: false, msg:'Failed to register user'});
        }else{
            res.json({success:true, msg:'User registered', user});
        }
    });

});

//Authenticate
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
  
    User.getUserByUsername(username, (err, user) => {
      if(err) throw err;
      if(!user){
        return res.json({success: false, msg: 'User not found'});
      }
  
      User.comparePassword(password, user.password, (err, isMatch) => {
        if(err) throw err;
        if(isMatch){
          const token = jwt.sign({user}, config.secret, {
            expiresIn: 604800 // 1 week
          });
  
          res.json({
            success: true,
            token: 'JWT '+ token,
            user: {
              id: user._id,
              name: user.name,
              username: user.username,
              email: user.email
            }
          });
        } else {
          return res.json({success: false, msg: 'Wrong password', user});
        }
      });
    });
  });

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({user: req.user});
});


// AdminProfile


router.get('/profile/userlist', (req, res, next) => {
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

router.delete('/profile/userlist/:id', (req, res, next) => {
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

router.put('/profile/userlist/:id', (req, res, next) => {
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


router.put('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  const bill = {
    date: req.body.date,
    description: req.body.description,
    value: req.body.value
  }
  const id = req.user._id;


  User.getUserByID(id, (err, user) => {
    if (err) throw err;
    user.bills.push(bill);

    user.save((err, user) => {
        if (err) throw err;
        else{
          res.json({success: true, msg: 'Bill added', user});
        }
    });
});
});

  

router.delete('/profile/:id', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  
  const id=req.params.id;
  
  User.getUserByID(req.user._id, (err, user) => {
    if (err) throw err;
    
    else { bills = user.bills;
           const index = User.findBillbyID(id, bills);
      if (index!=null) {
        bills.splice(index, 1);
        user.bills = bills
        user.save((err, user) => {
          if (err) throw err;
          else{
            res.json({success: true, msg: 'Bill removed', user});
          }
      });
      } else {
        res.json({success: false, msg: 'Cannot remove', user})}

}});
});

module.exports = router;
