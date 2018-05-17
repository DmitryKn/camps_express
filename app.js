const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Campground = require('./models/camp.js'); //camp schema
// const Comment = require('./models/comment.js'); //comment schema
// const User = require('./models/user.js'); //user schema
const seedDB = require('./seeds.js');
//=== mongoose db
mongoose.connect("mongodb://localhost/camping");

seedDB();
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

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//===ROUTES
app.get("/", (req, res) => { //INDEX page
  res.render("landing")
})
app.get("/index", (req, res) => { // SHOW page
  Campground.find({}, function(err, allCamps){ //mongoose find()
    if(err){
      console.log(err);
    }else{
      res.render("index", {camps: allCamps});
    }
  })

})

//  show/:id
app.get("/index/:id", (req, res) => { // SHOW 1 item
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp) {
    if(err){
      console.log(err);
    } else {
      res.render("show", {camp: foundCamp});
    }
  })
})
//new + post
app.get("/index/new", (req, res) => { // NEW item form
  res.render('new.ejs')
})
app.post("/index", (req, res) => {
  var name = req.body.name;
  var image = req.body.image;
  var descr = req.body.description;
  var newCamp = {name: name, image: image, description: descr}
  Campground.create(newCamp, function(err, camp){
    if(err){
      console.log("error");
    }else{
      res.redirect('index');
    }
  })

})
app.listen(3000, (req, res) => {
  console.log("Server has started. Port: 3000")
})
