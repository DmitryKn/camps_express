const middlewareObject = {};
const Campground = require('../models/camp.js'); //camp schema
const Comment = require('../models/comment.js'); //comment schema

//check camp form ownership
middlewareObject.checkCampOwnership = (req, res, next) => {
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, (err, foundCamp) => {
          if(err){
            res.redirect("back");
          }else{
            if(foundCamp.author.id.equals(req.user._id)){
              next();
            } else{
              res.redirect("back");
            }
          }
        });
    } else {
      res.redirect("back");
    }
  }
//check comment form ownership
middlewareObject.checkCommentOwnership = (req, res, next) => {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundComment) => {
          if(err){
            res.redirect("back");
          }else{
            if(foundComment.author.id.equals(req.user._id)){
              next();
            } else{
              res.redirect("back");
            }
          }
        });
    } else {
      res.redirect("back");
    }
  }

//
middlewareObject.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect("/login");
  }

module.exports = middlewareObject;
