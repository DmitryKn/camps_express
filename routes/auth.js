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
        req.flash("error", err.message);
        return res.render("register");
      } else {
        passport.authenticate("local")(req, res, () => {
          req.flash("success", "Welcome!" + user.username);
          res.redirect("/camps")
        })
      }
  });
});
//show login form
router.get("/login", (req, res) => {
  res.render("login");
});
router.post("/login", passport.authenticate("local", {
  successRedirect: "/camps",
  failureRedirect: "/login"
}), (req, res) => {});

//logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Logged you out.");
  res.redirect('/');
});


module.exports = router;
