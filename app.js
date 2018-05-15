const express = require("express");
const app = express();
const bodyParser = require("body-parser");


var arrayData = [
  {name: "Saugeen Springs RV Park", image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=350"},
  {name: "Amazing Rocky Park Campground", image: "https://bonvoyagejogja.com/wp-content/uploads/2017/02/IGjogjacamping.jpg"},
  {name: "Marmora KOA", image: "http://businessidei.com/uploads/posts/2013-05/1368357691_mini-kemping-1.jpg"}
]

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//===ROUTES
app.get("/", (req, res) => {
  res.render("index")
})
app.get("/campgrounds", (req, res) => {
  res.render("campgrounds", {camps: arrayData});
})
app.get("/campgrounds/new", (req,res) => {
  res.render('new.ejs')
})
//===POST
app.post("/campgrounds", (req, res) => {
  var name = req.body.name;
  var image = req.body.image;
  var newCamp = {name: name, image: image}
  arrayData.push(newCamp)
  res.redirect('/campgrounds');
})
app.listen(3000, (req, res) => {
  console.log("Server has started. Port: 3000")
})
