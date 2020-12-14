const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');

//validation

const validateProfileInput = require('../../validation/profile');
// load profile model
const Profile = require('../../models/Profile');

//load user model
const User = require('../../models/User');
const { validate } = require('../../models/User');



// @route GET api/profile/test
// @access Public

router.get('/test', (req,res) => res.json({msg: "profile works"}));


// @route GET api/profile
// desc : get user profile
// @access private

router.get('/',passport.authenticate('jwt', {session: false}), (req,res)=>{
const errors = {};
Profile.findOne({user: req.user.id})
.populate('user', ['name','avatar']).then(profile=>{
if(!profile){
errors.noProfile = 'There is no profile';
return res.status(404).json(errors);}

res.json(profile);
})
.catch(err => res.status(404).json(err)  
)


})
// @route POST api/profile
// desc : create/Update user profile
// @access private

router.post('/',passport.authenticate('jwt', {session: false}), (req,res)=>{
  
  const {errors,isValid} = validateProfileInput(req.body);

  if(!isValid){
    return res.status(400).json(errors);
  }

  //get fields
  profileFields= {};
  profileFields.user = req.user.id;

  if(req.body.handle) profileFields.handle = req.body.handle;
  if(req.body.company) profileFields.company = req.body.company;
  if(req.body.website) profileFields.website = req.body.website;
  if(req.body.location) profileFields.location = req.body.location;
  if(req.body.bio) profileFields.bio = req.body.bio;
  if(req.body.status) profileFields.status = req.body.status;
  // skills is an array in csv so splitting it
  if(typeof req.body.skills!== 'undefined'){
    profileFields.skills = req.body.skills.split(',');

  }

  // social media
  
  profileFields.social = {};

  if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if(req.body.instagram) profileFields.social.instagram = req.body.instagram;

  Profile.findOne({user: req.user.id}).then(profile => {
    if(profile) //checking if profile exist 
    //update
    {
      Profile.findOneAndUpdate({user: req.user.id},
         {$set: profileFields},
         {new: true})
         .then(profile => res.json(profile))
         .catch(err=> res.status(404).json(err))
    }
    else 
    //create
    {

      //checking handle
      Profile.findOne({handle: profileFields.handle}). then(profile=> {
        if(profile){// handle already exist
          errors.handle= 'already exist';
          res.status(400).json(errors);
        }

        //saving profile
        new Profile(profileFields).save().then(profile=> res.json(profile));

      })



    }
  })



  }
  )

module.exports = router;