var express = require("express");
var app = express();


var arr = [
  {name: "Saugeen Springs RV Park", image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=350"},
  {name: "Amazing Rocky Park Campground", image: "https://bonvoyagejogja.com/wp-content/uploads/2017/02/IGjogjacamping.jpg"},
  {name: "Marmora KOA", image: "http://www.millets.co.uk/templates/millets.co.uk/_images/homepage2018/180322/Camping/camping-page_13.jpg"}
]
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index")
})
app.get("/campgrounds", (req, res) => {
  res.render("campgrounds", {camps: arr});
})

app.listen(3000, (req, res) => {
  console.log("Server has started. Port: 3000")
})
