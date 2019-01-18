const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const wikiQueries = require("../db/queries.wikis.js");
const User = require("../db/models").User;

const stripeSecret = process.env.STRIPE_TEST_API_KEY;
const sgMail = require('@sendgrid/mail');
const stripe = require("stripe")(stripeSecret);


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
        html: '<strong>Confirmation required!</strong>',
      };

      if (err) {
        req.flash("error", err);
        res.redirect("/users/sign_up");
      } else {

        passport.authenticate("local")(req, res, () => {
          req.flash("notice", `Success!! ${user.username}, You've successfully signed up!`);
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
    passport.authenticate("local", function(err, user, info){
            if(err){
        next(err);
      }
      
      if (!user) {
        req.flash("notice", "Error: The email or password you entered is incorrect.")
        res.redirect("/users/sign_in");
      }          
      
      req.logIn(user,function(err){
        if(err){
          next(err);
        }
        req.flash("notice", "You've successfully signed in!");
        res.redirect("/");
      });
    })
    (req, res, next);
  },
  signOut(req, res, next) {
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  },


  show(req, res, next) {
    userQueries.getUser(req.params.id, (err, user) => {
      if (err || user === undefined) {
        req.flash("notice", "Error: No user found with that ID.");
        res.redirect("/");
      } else {
        res.render("users/show", {
          user

        });
      }
    });
  },
  upgrade(req, res, next) {
    const token = req.body.stripeToken;

    const charge = stripe.charges.create({
      amount: 1699,
      currency: 'usd',
      description: 'Premium',
      source: token,
    })

    userQueries.upgradeRole(req, (err, result) => {
      if (err || result.id === undefined) {
        req.flash("notice", "Purchase Error, please try again.");
        res.redirect("users/paymentDecline");
      } else {
        req.flash("notice", "Plan upgraded to premium!");
        res.render("users/payment", {
          result
        });
      }
    })
  },
  downgrade(req, res, next) {
  userQueries.getUser(req.params.id, (err, user) => {
    if (err || user === undefined) {
      req.flash("notice", "Downgrade unsuccessful.");
      res.redirect("users/show", {user});
    } else {
      userQueries.downgradeRole(user);
      
      wikiQueries.wikiNowPrivate(user);
      req.flash("notice", "You've been downgraded to Standard!");
      res.redirect("/");
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