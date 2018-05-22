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


//  show/:id
router.get("/:id", (req, res) => { // SHOW 1 item
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp) {
    if(err){
      console.log(err);
    } else {
      res.render("camps/show", {camp: foundCamp});
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
