const express = require('express');
const router = express.Router();
const Campground = require('../models/camp.js'); //camp schema
const middleware = require('../middleware/middleware.js');

// ===============
// CAMPS ROUTES
// ===============

//SHOW ALL
router.get("/", (req, res) => { // SHOW page
  Campground.find({}, (err, allCamps) =>{ //mongoose find()
    if(err){
      console.log(err);
    }else{
      res.render("camps/index", {camps: allCamps});
    }
  });
});

//CREATE new + post
router.get("/new", middleware.isLoggedIn, (req, res) => { // NEW item form
  res.render("camps/new");
});

router.post("/", middleware.isLoggedIn, (req, res) => {
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var descr = req.body.description;
  var location = req.body.location;
  var autor = {
    id: req.user._id,
    username: req.user.username
  }
  var newCamp = {name: name, price: price, image: image, description: descr, location: location, author: autor}
  Campground.create(newCamp, (err, camp) => {
    if(err){
      console.log(err);
    } else {
      res.redirect("/camps");
    }
  });
});


// show/:id
router.get("/:id", (req, res) => { // SHOW 1 item
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp) {
    if(err){
      console.log(err);
    } else {
      res.render("camps/show", {camp: foundCamp});
    }
  });
});

//EDIT form
router.get("/:id/edit", middleware.checkCampOwnership, (req, res) => {
      Campground.findById(req.params.id, (err, foundCamp) => {
        if(err){
          console.log(err);
        } else {
          res.render("camps/edit", {camp: foundCamp});
        }
      });
});
//UPDATE form
router.put("/:id", middleware.checkCampOwnership, (req, res) => {
  Campground.findByIdAndUpdate(req.params.id, req.body.camp, (err, updatedCamp) => {
    if(err){
      console.log(err);
      res.redirect("/camps")
    } else {
      res.redirect("/camps/" + req.params.id);
    }
  });
});

//DELETE form
router.delete("/:id", middleware.checkCampOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, (err) => {
    if(err){
      console.log(err);
      res.redirect("/camps");
    } else {
      res.redirect("/camps");
    }
  });
});

module.exports = router;
