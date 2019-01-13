module.exports = {
    validateUsers(req, res, next) {
  
      if(req.method === "POST") {

        req.checkBody("username", "must be 4 character").isLength({min: 4});
        req.checkBody("email", "must be a valid address").isEmail();
        req.checkBody("password", "must be at least 6 characters in length").isLength({min: 6});
        req.checkBody("passwordConfirm", "must match password").optional().matches(req.body.password);
      }
  
      const errors = req.validationErrors();
  
      if (errors) {
  
        req.flash("error", errors);
        return res.redirect(303, req.headers.referer)
      } else {
        return next();
      }
    },

    validateWikis(req, res, next){
        if(req.method === "POST") {
        req.checkBody("title", "must be at least 2 characters in length").isLength({min: 2});
        req.checkBody("body", "must be at least 10 characters in length").isLength({min: 10});
      }
      const errors = req.validationErrors();
      if (errors) {
        req.flash("error", errors);
        return res.redirect(303,req.headers.referer);
      } else {
        return next();
      }
    },

  }

    