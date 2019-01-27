

const userQueries = require("../db/queries.users");
const passport = require("passport");
const wikiQueries = require("../db/queries.wikis");
const User = require("../db/models").User;
const stripeSecret = process.env.STRIPE_TEST_API_KEY;

const stripe = require("stripe")(stripeSecret);




module.exports = {

  show(req, res, next) {
  
    userQueries.getUser(req.params.id, (err, user) => {
      if (err || user === undefined) {
        req.flash("notice", "No user found with that ID");
        res.redirect("/");
      } else {
        res.render("users/show", {
          user
        });
      }
    });
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
          req.flash("error", err);
          res.redirect("/users/sign_up");
      } else {

        passport.authenticate("local")(req, res, () => {
          req.flash("notice", `Success!!  ${user.username}  , You've successfully signed up!`);
        
          res.redirect("/");
        })
      }
    })
  },
  signUp(req, res, next) {
    res.render("users/sign_up");
  },


  signInForm(req, res, next) {
    res.render("users/sign_in");
  },

  signIn(req, res, next) {
    passport.authenticate("local")(req, res, function () {

      if (!req.user) {
        req.flash("notice", "Sign in failed. Please try again.")
        res.redirect("/users/sign_in");
      } else {
        req.flash("notice", "You've successfully signed in!");
        res.redirect("/");
      }
    });
  },

  signOut(req, res, next) {
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  },

  upgrade(req, res, next) {
    const token = req.body.stripeToken;

    const charge = stripe.charges.create({
      amount: 1699,
      currency: 'usd',
      description: 'Premium',
      source: token,
    })

    userQueries.upgrade(req, (err, user) => {
      if (err || user.id === undefined) {
        req.flash("notice", "Upgrade Unsuccessful.");
        res.redirect("users/paymentDecline");
      } else {
        req.flash("notice", "Thank you for upgrading to the premium plan!");
        res.render("users/payment", {
          user
        });
      }
    })
  },

  showCollaborations(req, res, next) {
    userQueries.getUser(req.user.id, (err, result) => {
      user = result["user"];
      collaborations = result["collaborations"];
      if (err || user == null) {
        res.redirect(404, "/");
      } else {
        res.render("users/collaborations", {
          user,
          collaborations
        });
      }
    });
  },

  downgrade(req, res, next) {
    userQueries.downgrade(req, (err, user) => {
      if (err || user.id === undefined) {
        req.flash("notice", "Downgrade Declined.");
        res.redirect("users/show");
      } else {
        wikiQueries.wikiNowPublic(req.user.dataValues.id);
        req.flash("notice", "Back to the basics.");
        res.render("users/standard_role", {
          user
        });
      }

    })
  },
  standard_role(req, res, next) {
    res.render("users/standard_role");
  },


  payment(req, res, next) {
    res.render("users/payment");
  },

  paymentDecline(req, res, next) {
    res.render("users/paymentDecline");
  },


}