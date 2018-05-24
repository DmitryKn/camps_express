const middlewareObject = {};
const Campground = require('../models/camp.js'); //camp schema
const Comment = require('../models/comment.js'); //comment schema

//check camp form ownership
middlewareObject.checkCampOwnership = (req, res, next) => {
    Campground.findById(req.params.id, function(err, foundCamp){
      if(err || !foundCamp){
          console.log(err);
          req.flash('error', 'Sorry, that camp does not exist!');
          res.redirect('/camps');
      } else if(foundCamp.author.id.equals(req.user._id) || req.user.isAdmin){
          req.camp = foundCamp;
          next();
      } else {
          req.flash('error', 'You don\'t have permission to do that!');
          res.redirect('/camps/' + req.params.id);
      }
    });
  }
//check comment form ownership
middlewareObject.checkCommentOwnership = (req, res, next) => {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundComment) => {
          if(err || !foundComment){
           console.log(err);
           req.flash('error', 'Sorry, that comment does not exist!');
           res.redirect('/campgrounds');
       } else if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
            req.comment = foundComment;
            next();
       } else {
           req.flash('error', 'You don\'t have permission to do that!');
           res.redirect('/campgrounds/' + req.params.id);
       }
    });
  }
}
  //admin chech
middlewareObject.isAdmin = (req, res, next) => {
    if(req.user.isAdmin) {
      next();
    } else {
      req.flash('error', 'This site is now read only thanks to spam and trolls.');
      res.redirect('back');
    }
  }
// authentication user
middlewareObject.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
      return next();
    }
    req.flash("error", "You must be signed in to do that!");
    res.redirect("/login");
  }

module.exports = middlewareObject;
