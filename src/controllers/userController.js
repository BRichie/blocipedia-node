const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const User = require("../db/models").User;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


module.exports = {


  create(req, res, next) {
    let newUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm
    };

    userQueries.createUser(newUser, (err, user) => {
      const msg = {
        to: newUser.email,
        from: 'lebron@lakeshow.com',
        subject: 'User Confirmation',
        text: 'Confirm your Blocipedia account.',
        html: '<strong>Please login to your account to confirm membership!</strong>',
      };

      if (err) {
        req.flash("error", err);
        res.redirect("/users/sign_up");
      } else {

        passport.authenticate("local")(req, res, () => {
          req.flash("notice", "You've successfully signed up!");
          sgMail.setApiKey(process.env.SENDGRID_API_KEY);
          sgMail.send(msg);


          res.redirect("/");
        })
      }
    });
  },
  signUp(req, res, next) {
    res.render("users/sign_up");
  },


  signInForm(req, res, next) {
    res.render("users/sign_in");
  },

  signIn(req, res, next) {
    passport.authenticate("local")(req, res, function ()  {
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