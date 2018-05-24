const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/camp.js'); //camp schema
const Comment = require('../models/comment.js'); //comment schema
const middleware = require('../middleware/middleware.js');
const moment = require('moment');

// ===============
// COMMENTS ROUTES
// ===============

//CREATE new comment + post
router.get("/new", middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) =>{
    if(err){
      console.log(err);
    }else{
      res.render("comments/new", {camp: campground});
    }
  });
});
router.post("/", middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if(err){
      console.log(err);
      res.redirect("/camps");
    }else{
      Comment.create(req.body.comment, (err, comment) => {
        if(err){
          console.log(err);
        } else {

          comment.author.id = req.user._id;
          comment.createdAt = req.user.createdAt;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          req.flash("success", "Comment successfully added.");
          res.redirect("/camps/" + campground._id);
        }
      });
    }
  });
});
//EDIT comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if(err){
      res.redirect("/camps");
    } else {
      res.render("comments/edit", {camp_id: req.params.id, comment: foundComment});
    }
  });
});
//UPDATE comment
router.put("/:comment_id/", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
    if(err){
      res.render("edit");
    } else {
      res.redirect("/camps/" + req.params.id);
    }
  });
});
//DELETE comment
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if(err) {
      res.redirect("back");
    } else {
      req.flash("success", "Comment deleted");
      res.redirect("/camps/" + req.params.id);
    }
  });
});


module.exports = router;
