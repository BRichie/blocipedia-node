const Authorizer = require("../policies/application");
const User = require('./models').User;
const Wiki = require('./models').Wiki;
const Collaborator = require('./models').Collaborator;

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
                            userId: users.id,
                            wikiId: req.params.wikiId
                        }
                    })
                    .then((collaborator) => {
                        if (collaborator) {
                            return callback("Already a collaborator")
                        }

                        let newCollaborator = {
                            userId: users.id,
                            wikiId: req.params.wikiId
                        };
                        return Collaborator.create(newCollaborator)
                        .then((collaborator) => {
                          callback(null, collaborator);
                        })
                            .then((collaborator) => {
                                callback(null, collaborator);
                            })

                           
							.catch(err => {
								callback(err, null);
							});
					})
					.catch(err => {
						callback(err, null);
					});
			})
			.catch(err => {
				callback(err, null);
			});
	},


    remove(req, callback) {
        let collaboratorId = req.body.collaborator;
        let wikiId = req.params.wikiId;
        const authorized = new Authorizer(req.user, wiki, collaboratorId).destroy();
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