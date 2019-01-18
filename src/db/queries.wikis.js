const Wiki = require("./models").Wiki;
const User = require("./models").User;
const Authorizer = require("../policies/application");


module.exports = {
    getAllWikis(userId, callback){
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
        return Wiki.create(newWiki)

            .then((wiki) => {
                callback(null, wiki);
            })
            .catch((err) => {
                callback(err);
            })
        },


    deleteWiki(req, callback) {
        return Wiki.findById(req.params.id)
            .then((wiki) => {
                const authorized = new Authorizer(req.user, wiki).destroy();

                if (authorized) {
                    wiki.destroy()
                        .then((deletedRecordsCount) => {
                            callback(null, deletedRecordsCount);
                        });
                } else {
                    //error hits here
                    req.flash("notice", "You are not authorized to do that....");
                    callback(401);
                }
            })
            .catch(err => {
                callback(err);
            });
    },
    updateWiki(req, updatedWiki, callback) {
        return Wiki.findById(req.params.id)
            .then((wiki) => {

                if (!wiki) {
                    return callback("404");
                } else {

                    wiki.update(updatedWiki, {
                            fields: Object.keys(updatedWiki)
                        })
                        .then(() => {
                            callback(null, wiki);
                        })
                }
            })
            .catch((err) => {
                callback(err);
            });

        },

    wikiNowPrivate(id) {
        // return Wiki.findAll()
        //     .then((wikis) => {
        //         wikis.forEach((wiki) => {
        //             if (wiki.userId == id && wiki.private == true) {
        //                 wiki.update({
        //                     private: false
        //                 })
        return Wiki.findAll({
            where: {userId: user.id}
          })
          .then((wikis) => {
            wikis.forEach((wiki) => {
              wiki.update({
                private: false
              })
            })
          })                
    
    .catch((err) => {
        console.log(err);
})
    },

        
    
    // wikiNowPublic(id) {
    //     return Wiki.all()
    //         .then((wikis) => {
    //             wikis.forEach((wiki) => {
    //                 if (wiki.userId == id && wiki.private == false) {
    //                     wiki.update({
    //                         private: false
    //                     })
    //                 }
    //             })
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         })

}