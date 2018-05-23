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
const methodOverride = require('method-override');
const flash = require('connect-flash');

const commentRoutes = require("./routes/comments.js"), //express.router
      campRoutes    = require("./routes/camps.js"),
      authRoutes    = require("./routes/auth.js");

//=== mongoose db
mongoose.connect("mongodb://localhost/camping");

//seedDB(); //add some hardcoded camps

// APP configuration
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(require("express-session")({
 secret: "Secret phrase",
 resave: false,
 saveUninitialized: false
}));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {   //variables
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});
//requiring routes
app.use("/", authRoutes);
app.use("/camps", campRoutes);
app.use("/camps/:id/comments", commentRoutes);



//=================
app.listen(3000, (req, res) => {
  console.log("Server has started. Port: 3000")
})
