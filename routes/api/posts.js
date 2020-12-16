const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');


//validate
const validatePostInput = require('../../validation/post');

// @route GET api/posts/test
// @access Public

router.get('/test', (req,res) => res.json({msg: "posts works"}));

// @route GET api/posts
//getting post
// @access public

router.get('/',(req,res)=>{
Post.find()
.sort({date: -1})
.then(posts => res.json(posts))
.catch(err=> res.status(404).json({noPostId: 'no post found with this id'} ))
});


// @route GET api/posts/:id
//getting post by id
// @access public

router.get('/:id',(req,res)=>{
  Post.findById(req.params.id)
  .then(post => res.json(post))
  .catch(err=> res.status(404).json({noPostId: 'no post found with this id'} ))
  });

// @route POST api/posts
//creating post
// @access Private

router.post('/',passport.authenticate('jwt', {session: false}), (req,res)=>{

  const { errors, isValid} = validatePostInput(req.body);

  if(!isValid){

    return res.status(400).json(errors);
  }

  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id,
  });

  newPost.save().then(post => res.json(post));

});

// @route Delete api/posts/:id
//deleting post
// @access Private

router.delete('/:id', passport.authenticate('jwt', {session: false}), (req,res)=>{
Profile.findOne({user: req.user.id})
.then(profile => {
Post.findById(req.params.id).findOne
.then(post => {
  if(post.user.toString() !== req.user.id){
    return res.status(401).json({notauthorised: 'user not authorised'});
  }

  // removing 

  post.remove().then(()=> res.json({success: true}));
})
.catch(err => res.status(404).json({notFound: "Post not Found"}));
})
});

// @route Post api/posts/like/:id
//likes on post
// @access Private

router.post('/like/:id', passport.authenticate('jwt', {session: false}), (req,res)=>{
  Profile.findOne({user: req.user.id})
  .then(profile => {
  Post.findById(req.params.id).findOne
  .then(post => {
    if(post.likes.filter(like => like.user.toString() === req.user.id).length>0){
      return res.status(400).json({alreadyliked: 'post already liked'})
    }

    // liking post

    post.likes.unshift({user : req.user.id});

    post.save().then(post=> res.json(post));
    
  })
  .catch(err => res.status(404).json({notFound: "Post not Found"}));
  })
  });

  
// @route Post api/posts/unlike/:id
//unlike the post
// @access Private

router.post('/unlike/:id', passport.authenticate('jwt', {session: false}), (req,res)=>{
  Profile.findOne({user: req.user.id})
  .then(profile => {
  Post.findById(req.params.id).findOne
  .then(post => {
    if(post.likes.filter(like => like.user.toString() === req.user.id).length===0){
      return res.status(400).json({notliked: 'post not liked '})
    }

    //index of user 
    const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id);

    // splicing array

    post.likes.splice(removeIndex,1);
    post.save().then(post=> res.json(post));
    
  })
  .catch(err => res.status(404).json({notFound: "Post not Found"}));
  })
  });
  // @route   POST api/posts/comment/:id
// @desc    Add comment to post
// @access  Private
router.post(
  '/comment/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        // Add to comments array
        post.comments.unshift(newComment);

        // Save
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Remove comment from post
// @access  Private
router.delete(
  '/comment/:id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // Check to see if comment exists
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: 'Comment does not exist' });
        }

        // Get remove index
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        // Splice comment out of array
        post.comments.splice(removeIndex, 1);

        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
  }
);

module.exports = router;