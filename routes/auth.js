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
// registration logic
router.post("/register", (req, res) => {
  const newUser = new User({
    username: req.body.username,
    avatar: req.body.avatar,
    email: req.body.email
  });
  if(req.body.adminCode === "adminko") {
      newUser.isAdmin = true;
  }
  //=== process.env.ADMIN_CODE
  User.register(newUser, req.body.password, (err, user) => {
      if(err){
          console.log(err);
          return res.render("register", {error: err.message});
      } else {
        passport.authenticate("local")(req, res, () => {
          req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
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
  req.flash("success", "See you later!");
  res.redirect('/camps');
});

//USER PROFILE
router.get("/users/:id", (req, res) => {
  User.findById(req.params.id, (err, foundUser) => {
      if(err){
        req.flash("error", "User not found");
        res.redirect("/camps");
      } else {
        res.render("users/show", {user: foundUser})
      }
  });
});

module.exports = router;
