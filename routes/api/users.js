const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require ('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

//user model import
const User = require('../../models/User');

//loading input validation

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');


// @route GET api/users/test
// @access Public

router.get('/test', (req,res) => res.json({msg: "Users works"}));


// @route GET api/users/register
//for user registration
// @access Public

router.post('/register', (req,res) => {
  // destructuring 
    const {errors, isValid} = validateRegisterInput(req.body); 

    if(!isValid){
      return res.status(400).json(errors);
    }
User.findOne({email : req.body.email})
.then(user => {
  if(user){
    return res.status(400).json({email : 'Email already exist'});
  }
  else {
    const avatar = gravatar.url(req.body.email, {
      s : '200', //size
      r : 'pg', // rating,
      d : 'mm' // default
    })
    const newUser = new User({
    name : req.body.name,
    email : req.body.email,
    avatar,
    password : req.body.password
    })

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password,salt, (err,hash)=> {
        if(err) throw err;
        newUser.password = hash;
        newUser.save().then(user => res.json(user))
        .catch(err => console.log(err));
      })
    })
  }
})
});

// @route GET api/users/Login
//for user login/ jwt 
// @access Public

router.post('/login', (req,res)=> {

  const {errors, isValid} = validateLoginInput(req.body); 

    if(!isValid){
      return res.status(400).json(errors);
    }

  const email = req.body.email;
  const password = req.body.password;

  //finding user using email
  User.findOne({email})
  .then(user => {
    if(!user){
      errors.email = "User not found"
    return res.status(404).json(errors);}

    //checking password
    bcrypt.compare(password,user.password)
    .then(isMatch => {
      if(isMatch){
        //user matched

        const payload = {id: user.id, name: user.name, avatar: user.avatar} //jwt payload

        // jwt sign

      jwt.sign(payload,
        keys.secretOrKey,
        {expiresIn : 3600},
        (err,token) => {
          if(err)
          throw(err);
          else 
          return res.json({
            Success: true,
            token: 'bearer ' + token
          })

        })
      }
      else 
     { errors.password = 'Password Incorrect';
      return res.status(400).json(errors);}
    })
  })


});

// @route GET api/users/current
//for showing current user
// @access Private

router.get('/current', passport.authenticate('jwt',{session: false}), (req,res)=> {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
})

module.exports = router;