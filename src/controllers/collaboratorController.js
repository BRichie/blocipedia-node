const express = require("express");
const router = express.Router();
const wikiQueries = require("../db/queries.wikis");
const userQueries = require("../db/queries.users")
const collaboratorQueries = require("../db/queries.collaborators");
const Authorizer = require("../policies/application");

module.exports = {
  
  create(req, res, next) {

  collaboratorQueries.create(req, (err, collaborator) => {
    if (err) {
      req.flash("error", err);
    }
    res.redirect(`/wikis/${req.params.wikiId}/collaborators`);
  });
},
show(req, res, next) {

  userQueries.getUser(req.params.id, (err, result) => {
     wiki = result["wiki"];
     collaborators = result["collaborators"];
        if (err || wiki == undefined) {
      res.redirect(404, "/");
    } else {
        const authorized = new Authorizer(
          req.user,
          wiki,
          collaborators
        ).showCollaborators();
     
        if (authorized) {
          wiki.body = markdown.toHTML(wiki.body);
          res.render("user/collaborations", { wiki, collaborators });
        } else {
          req.flash("notice", "You are not authorized to do that.");
          res.redirect(`/wikis`);
        }
      }
    });
  },

edit(req, res, next) {
  wikiQueries.getWiki(req.params.wikiId, (err, result) => {
      
    let wiki = result["wiki"];
       let collaborators = result["collaborators"];

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
        res.redirect(`/wikis/${req.params.wikiId}/collaborators`);
      });
    } else {
      req.flash("notice", "You must be signed in to remove Collaborators!");
      res.redirect("/");
    }
  }
};