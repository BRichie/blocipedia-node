const express = require("express");
const router = express.Router();
const wikiQueries = require("../db/queries.wikis.js");
const collaboratorQueries = require("../db/queries.collaborators.js");
const Authorizer = require("../policies/application");

module.exports = {
  
  create(req, res, next) {

  collaboratorQueries.create(req, (err, collaborator) => {
    if (err) {
      req.flash("error", err);
    }
    res.redirect(req.headers.referrer);
  });
},

edit(req, res, next) {
  wikiQueries.getWiki(req.params.wikiId, (err, result) => {
      wiki = result["wiki"];
      collaborators = result["collaborators"];

      if (err || result.wiki == null) {
          res.redirect(404, "/");
      } else {
          const authorized = new Authorizer(req.user, wiki, collaborators).edit();
          if (authorized) {
              res.render("collaborators/show", {
                  wiki,
                  collaborators
              });
          } else {
              req.flash("notice", "You are not authorized to do that");
              res.redirect(`/wikis/${req.params.wikiId}`)
          }
      }
  });
},

  remove(req, res, next) {
    if (req.user) {
      collaboratorQueries.remove(req, (err, collaborator) => {
        if (err) {
          req.flash("error", err);
        }
        res.redirect(req.headers.referrer);
      });
    } else {
      req.flash("notice", "You must be signed in to remove Collaborators!");
      res.redirect(req.headers.referrer);
    }
  }
};