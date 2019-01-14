const userQueries = require("../db/queries.users.js");
const passport = require("passport");

module.exports = {
    signUp(req, res, next){
      res.render("users/sign_up");
    },

    create(req, res, next){
      let newUser = {
        username: req.body.username,
        email: (req.body.email).toLowerCase(),
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
      };
 // #2
      userQueries.createUser(newUser, (err, user) => {
        if(err){
          req.flash("notice", "Error: Email already associated with account");
          res.redirect("/users/sign_up");
        } else {
 

          passport.authenticate("local")(req, res, () => {
            req.flash("notice", "You've successfully signed in!");
            res.redirect("/");
          })
        }
      });
    },
    
    signInForm(req, res, next){
        res.render("users/sign_in");
      },

      signIn(req, res, next){
        passport.authenticate("local", function(err, user, info){
          if(err){
            next(err);
          }
          if(!user){
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
        })(req, res, next);
      },
      signOut(req, res, next){
        req.logout();
        req.flash("notice", "You've successfully signed out!");
        res.redirect("/");
      },
  
  }
  