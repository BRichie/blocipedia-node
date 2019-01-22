const collaboratorQueries = require("../db/queries.collaborators.js");
const Authorizer = require("../policies/application");
const wikiQueries = require("../db/queries.wikis.js");
const User = require("../db/models").User;
const Wiki = require("../db/models").Wiki;

module.exports = {

    create(req, res, next) {
        collaboratorQueries.createCollaborator(req, (err, collaborator) => {
            if (err) {
                req.flash("notice", "User exists")
            }
                res.redirect(`/wikis/${req.params.wikiId}/collaborators`);
            });
          },
    

    delete(req, res, next) {
        if(req.user) {
        collaboratorQueries.deleteCollaborator(req, (err, collaborator) => {  
            if (err) {
                req.flash("error", err);
            }
            res.redirect(req.headers.referer);
        });
    } else {
        req.flash("notice", "You must be signed in to do that");
        res.redirect(req.headers.referer);
    }
},

    show(req, res, next) {
        wikiQueries.getWiki(req.params.wikiId, (err, result) => {
            wiki = result["wiki"];
            collaborators = result["collaborators"];

            if (err || result.wiki == null) {
                res.redirect(404, "/");
            } else {
                const authorized = new Authorizer(req.user, wiki, collaborators).edit();
                if (authorized) {
                    res.render("collaborators/show", { wiki, collaborators });
                } else {
                    req.flash("notice", "You are not authorized to do that.");
                    res.redirect(`/wikis/${req.params.wikiId}`)
                }
            }
        });
    },
}
