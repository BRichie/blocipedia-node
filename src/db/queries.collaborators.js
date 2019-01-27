const Collaborator = require("./models").Collaborator;
const Wiki = require("./models").Wiki;
const User = require("./models").User;
const Authorizer = require("../policies/application");


module.exports = {

    create(req, callback) {
     if (req.user.username == req.body.collaborator) {
            return callback("You cannot add yourself as a collaborator");
         }

        User.findOne({
                where: {
                    username: req.body.collaborator
                }
            })
            .then((users) => {
                if (!users) {
                    return callback("User does not exist")
                }

                Collaborator.findOne({
                        where: {
                            userId: user.id,
                            wikiId: req.params.wikiId
                        }
                    })
                    .then((collaborators) => {
                        if (collaborators.length != 0) {
                            return callback(`${
                                req.body.collaborator
                              } is a collaborator.`
                            );
                        }

                        let newCollaborator = {
                            userId: user.id,
                            wikiId: req.params.wikiId
                        };
                        return Collaborator.create({
                            userId: user.id,
                            wikiId: req.params.wikiId
                        })
                        .then((collaborator) => {
                            callback(null, collaborator);
                        })
                  
                            .catch((err) => {
                                callback(err, null);
                            });
                        })
                        .catch((err) => {
                          callback(err, null);
                        });
                    })
                    .catch((err) => {
                      callback(err, null);
                    });
                },
                   
    
    remove(req, callback) {
        let collaboratorId = req.body.collaborator;
        let wikiId = req.params.wikiId;

        const authorized = new Authorizer(req.user, wiki, collobaratorId).destroy();

        if (authorized) {

                Collaborator.destroy({
                    where: {
                        userId: collaboratorId,
                        wikiId: wikiId

                    }
                })
                .then((deletedRecord) => {
                    callback(null, deletedRecord);
                })
                .catch((err) => {
                    callback(err);
                });
        } else {
            req.flash("notice", "Authorization Denied")
            callback(401);
        }

    }

};