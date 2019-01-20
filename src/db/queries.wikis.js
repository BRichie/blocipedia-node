const Wiki = require("./models").Wiki;
const Authorizer = require("../policies/application");
const User = require("./models").User;



module.exports = {
    
    getAllWikis(callback) {
        let result = {};
        return Wiki.all()
            .then((wikis) => {
                result["wikis"] = wikis;
                callback(null, result);
            })
            .catch((err) => {
                callback(err);
            })
    },




    getWiki(id, callback) {
        return Wiki.findById(id)
            .then((wiki) => {
                callback(null, wiki);
            })
            .catch((err) => {
                callback(err);
            })
    },

    addWiki(newWiki, callback) {
        return Wiki.create({
            title: newWiki.title,
            body: newWiki.body,
            private: newWiki.private,
            userId: newWiki.userId
          })
          .then((wiki) => {
            callback(null, wiki);
          })
          .catch((err) => {
            callback(err);
          })
        },

    deleteWiki(id, callback) {
        return Wiki.destroy({
            where: { id }
           
                })
                .then((wiki) => {
                    callback(null, wiki);
            })
            .catch((err) => {
                callback(err);
            })
    },
    updateWiki(req, updatedWiki, callback) {
        return Wiki.findById(req.params.id)
            .then((wiki) => {

                if (!wiki) {
                    return callback("404");
                }
                const authorized = new Authorizer(req.user, wiki).update();

                if (authorized) {

                    wiki.update(updatedWiki, {
                            fields: Object.keys(updatedWiki)
                        })
                        .then(() => {
                            callback(null, wiki);
                        })
                        .catch((err) => {
                            callback(err);
                        });
                } else {
                    req.flash("notice", "You are not authorized to do that.");
                    callback("DENIED");
                }
            });
    },

    wikiNowPrivate(id) {
        return Wiki.All()
            .then((wikis) => {
                wikis.forEach((wiki) => {
                    if (wiki.userId == id && wiki.private == false) {
                        wiki.update({
                            private: true
                        })
                    }
                })
            })
            .catch((err) => {
                console.log(err);
            })
        },
       



    wikiNowPublic(id) {
        return Wiki.all()
            .then((wikis) => {
                wikis.forEach((wiki) => {
                    if (wiki.userId == id && wiki.private == true) {
                        wiki.update({
                            private: false
                        })
                    }
                })
            })
            .catch((err) => {
                console.log(err);
            })
        }

}