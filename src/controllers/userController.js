
const userQueries = require("../db/queries.users.js");
const wikiQueries = require("../db/queries.wikis.js");
const passport = require("passport");
const publishableKey = process.env.PUBLISHABLE_KEY;

module.exports = {

  index(req, res, next) {
    res.render("/");
  },

  signUp(req, res, next) {
    res.render("users/sign_up");
  },

  create(req, res, next) {
    let newUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm
    };
    
    userQueries.createUser(newUser, (err, user) => {
      if (err) {
        req.flash("notice", "Error: Email already associated with account");
        res.redirect("/users/sign_up");
      } else {

        passport.authenticate("local")(req, res, () => {
          req.flash("notice", "You've successfully signed up!");
          res.redirect("/");
        })
      }
    });
  },

  signInForm(req, res, next) {
    res.render("users/sign_in");
  },

  signIn(req, res, next) {
    passport.authenticate("local")(req, res, () => {
      if (!req.user) {
        req.flash("notice", "Error: The email or password you entered is incorrect.")
        res.redirect("/users/sign_in");
      } else {
        req.flash("notice", "You've successfully signed in!");
        res.redirect("/");
      }
    })
  },
  signOut(req, res, next) {
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  },
  
  
  // show(req, res, next) {
  //   userQueries.getUser(req.params.id, (err, user) => {
  //     if (err || user === undefined) {
  //       req.flash("notice", "Error: No user found with that ID.");
  //       res.redirect("/");
  //     } else {
  //       res.render("users/show", {
  //         user
  //       });
  //     }
  //   });
  // },

}