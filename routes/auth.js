const express = require('express');
const router = express.Router();
const User = require('../models/user.js'); //user schema
const passport = require('passport');

//===ROUTES
router.get("/", (req, res) => { //INDEX page
  res.render("landing")
});

// ===============
// AUTH ROUTES
// ===============

router.get("/register", (req, res) => { //show form
  res.render("register");
});
router.post("/register", (req, res) => {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user) => {
      if(err){
        console.log("something wrong");
        return res.render("register");
      } else {
        passport.authenticate("local")(req, res, () => {
          res.redirect("/camps")
        })
      }
  });
});
//show login form
router.get("/login", (req, res) => {
  res.render("login")
});
router.post("/login", passport.authenticate("local", {
  successRedirect: "/camps",
  failureRedirect: "/login"
}), (req, res) => {});

//logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect('/');
});


// MIDDLEWARE - if login -access
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
