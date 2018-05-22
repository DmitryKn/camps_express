const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/camp.js'); //camp schema
const Comment = require('../models/comment.js'); //comment schema

// ===============
// COMMENTS ROUTES
// ===============

//NEW comments
router.get("/new", isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) =>{
    if(err){
      console.log(err);
    }else{
      res.render("comments/new", {camp: campground})
    }
  })
})
router.post("/", isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if(err){
      console.log(err);
      res.redirect("/landing")
    }else{
      Comment.create(req.body.comment, function(err, comment) {
        if(err){
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          res.redirect("/camps/" + campground._id)
        }
      })
    }
  })
})

// MIDDLEWARE - if login -access
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
