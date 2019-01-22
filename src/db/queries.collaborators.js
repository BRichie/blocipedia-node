const Collaborator = require("./models").Collaborator;
const Wiki = require("./models").Wiki;
const User = require("./models").User;
const Authorizer = require("../policies/application");

module.exports = {

    createCollaborator(req, callback) {

        if(req.user.username == req.body.collaborator) {
            return callback("You are already a collaborator");
          }
      
        User.findOne({
            where: {
                username: req.body.collaborator
            }
        })
            .then((user) => {
                if (!user) {
                    return callback("User does not exist")
                }
                Collaborator.findOne({
                    where: {
                        userId: user.id,
                        wikiId: req.params.wikiId
                    }
                })
                    .then((collaborator) => {
                        if (collaborator) {
                            return callback('This user is already a collaborator on this wiki.')
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
                                callback(err);
                            })
                    })
            })
    },

    deleteCollaborator(req, callback) {
        let userId = req.body.collaborator;
        let wikiId = req.params.wikiId;
        const authorized = new Authorizer(req.user, wikiId, userId).destroy();

        if (authorized) {
            Collaborator.destroy({
                where: {
                    userId: userId,
                    wikiId: wikiId
                    
                }
            })
                .then((deletedRecords) => {
                    callback(null, deletedRecords);
                })
                .catch((err) => {
                    callback(err);
                });
        } else {
            req.flash("notice", "Authority not granted.")
            callback(401);
        }
    }

}