const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');

//validation

const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

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


});

// @route GET api/profile/handle/:handle
// desc : get user profile using handle
// @access public


router.get('/handle/:handle', (req,res)=> {

  const errors = {};

    Profile.findOne({handle: req.params.handle})
    .populate('user', ['name','avatar'])
    .then(profile=>{
      if(!profile){
        errors.noProfile = "There is no Profile for this user";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err=> res.status(400).json(err))
    
});

// @route GET api/profile/user/:user_id
// desc : get user profile using user id
// @access public


router.get('/user/:user_id', (req,res)=> {

  const errors = {};

    Profile.findOne({user: req.params.user_id})
    .populate('user', ['name','avatar'])
    .then(profile=>{
      if(!profile){
        errors.noProfile = "There is no Profile for this user";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err=> res.status(400).json({profile : 'No profile found for this user'}))
    
});

// @route GET api/profile/all
// desc : get user profile using user id
// @access public

router.get('/all', (req,res)=>{
  const errors = {};
  Profile.find()
  .populate('user', ['name', 'avatar'])
  .then(profiles => {
    if(!profiles){
      errors.noProfile = "There are no profiles";
      return res.status(404).json(errors);
    }

    res.json(profiles);
  })
  .catch(err=> res.status(400).json({profile : 'There are no profiles'}))
  
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

      });

      



    }
  })



  }
  );

  
// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post(
  '/experience',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // Add to exp array
      profile.experience.unshift(newExp);

      profile.save().then(profile => res.json(profile));
    });
  }
);


// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post(
  '/education',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // Add to exp array
      profile.education.unshift(newEdu);

      profile.save().then(profile => res.json(profile));
    });
  }
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete(
  '/experience/:exp_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // Get remove index
        const removeIndex = profile.experience
          .map(item => item.id)
          .indexOf(req.params.exp_id);

        // Splice out of array
        profile.experience.splice(removeIndex, 1);

        // Save
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete(
  '/education/:edu_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // Get remove index
        const removeIndex = profile.education
          .map(item => item.id)
          .indexOf(req.params.edu_id);

        // Splice out of array
        profile.education.splice(removeIndex, 1);

        // Save
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);


module.exports = router;