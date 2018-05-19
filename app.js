const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const Campground = require('./models/camp.js'); //camp schema
const Comment = require('./models/comment.js'); //comment schema
const User = require('./models/user.js'); //user schema
const seedDB = require('./seeds.js');
//=== mongoose db
mongoose.connect("mongodb://localhost/camping");

// seedDB();

// Campground.create({
//   name: "Forest Hill",
//   image: "https://awesomeworld.ru/wp-content/uploads/2015/05/autumn-2183489_1280-700x400.jpg",
//   description: "Great place. Nice view."
// }, function(err, camp) {
//   if(err){
//     console.log(err);
//   }else{
//     console.log("saved");
//   }
// })
// APP configuration
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(require("express-session")({
 secret: "Secret phrase",
 resave: false,
 saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//===ROUTES
app.get("/", (req, res) => { //INDEX page
  res.render("landing")
})
//index - show all
app.get("/index", (req, res) => { // SHOW page
  Campground.find({}, function(err, allCamps){ //mongoose find()
    if(err){
      console.log(err);
    }else{
      res.render("camps/index", {camps: allCamps});
    }
  })

})

//new + post
app.post("/index", (req, res) => {
  var name = req.body.name;
  var image = req.body.image;
  var descr = req.body.description;
  var newCamp = {name: name, image: image, description: descr}
  Campground.create(newCamp, function(err, camp){
    if(err){
      console.log("error");
    }else{
      res.redirect('camps/index');
    }
  })
})
app.get("/index/new", (req, res) => { // NEW item form
  res.render("camps/new");
})

//  show/:id
app.get("/index/:id", (req, res) => { // SHOW 1 item
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp) {
    if(err){
      console.log(err);
    } else {
      res.render("camps/show", {camp: foundCamp});
    }
  })
})
//new + comments
app.get("/index/:id/comments/new", (req, res) => {
  Campground.findById(req.params.id, (err, campground) =>{
    if(err){
      console.log(err);
    }else{
      res.render("comments/new", {camp: campground})
    }
  })
})
app.post("/index/:id/comments", function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if(err){
      console.log(err);
      res.redirect("/landing")
    }else{
      Comment.create(req.body.comment, function(err, comment) {
        if(err){
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect("/index/" + campground._id)
        }
      })
    }
  })
})

//
app.listen(3000, (req, res) => {
  console.log("Server has started. Port: 3000")
})
