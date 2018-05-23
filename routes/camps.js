const express = require('express');
const router = express.Router();
const Campground = require('../models/camp.js'); //camp schema

// ===============
// CAMPS ROUTES
// ===============

//SHOW ALL
router.get("/", (req, res) => { // SHOW page

  Campground.find({}, function(err, allCamps){ //mongoose find()
    if(err){
      console.log(err);
    }else{
      res.render("camps/index", {camps: allCamps});
    }
  })
})

//create new + post
router.get("/new", isLoggedIn, (req, res) => { // NEW item form
  res.render("camps/new");
})

router.post("/", isLoggedIn, (req, res) => {
  var name = req.body.name;
  var image = req.body.image;
  var descr = req.body.description;
  var autor = {
    id: req.user._id,
    username: req.user.username
  }
  var newCamp = {name: name, image: image, description: descr, author: autor}
  Campground.create(newCamp, function(err, camp){
    if(err){
      console.log("error");
    }else{
      res.redirect("/camps");
    }
  })
})


// show/:id
router.get("/:id", (req, res) => { // SHOW 1 item
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp) {
    if(err){
      console.log(err);
    } else {
      res.render("camps/show", {camp: foundCamp});
    }
  })
})

//EDIT
router.get("/:id/edit", checkOwnership, (req, res) => {
      Campground.findById(req.params.id, (err, foundCamp) => {
            res.render("camps/edit", {camp: foundCamp})
      });
});
//UPDATE
router.put("/:id", checkOwnership, (req, res) => {
  Campground.findByIdAndUpdate(req.params.id, req.body.camp, (err, updatedCamp) => {
    if(err){
      res.redirect("/camps")
    } else {
      res.redirect("/camps/" + req.params.id);
    }
  });
});

//DELETE
router.delete("/:id", checkOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, (err) => {
    if(err){
      console.log(err);
      res.redirect("/camps");
    } else {
      res.redirect("/camps");
    }
  });
});


// MIDDLEWARE - if login -access
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}
//authorization
function checkOwnership(req, res, next){
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





module.exports = router;
