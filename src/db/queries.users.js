const User = require("./models").User;
const bcrypt = require("bcryptjs");




module.exports = {

  createUser(newUser, callback) {
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

    return User.create({
        username: newUser.username,
        email: newUser.email,
        password: hashedPassword
      })
      .then((user) => {

        callback(null, user);
      })
      .catch((err) => {
        callback(err);
      });
  },

  getAllUsers(callback) {
    let result = {};
    return User.all()
      .then(users => {
        result['users'] = users;
        callback(null, result);
      })
      .catch((err) => {
        callback(err);
      })
  },
  getUser(id, callback) {
    let result = {};
    User.findById(id)
      .then((user) => {
        if (!user) {
          callback(404);
        } else {
          result['user'] = user;
          callback(null, result);
          return user;
        };
      })
  },




  upgradeRole(req, callback) {
    return User.findbyId(req.result.id)
    

     .then((user) => {
       if(user.role == "standard"){
         user.update({
           role: "premium"
         })
        }
      })
    },
      
  downgradeRole(req, callback) {
    return User.findById(req.user.id)

      .then((user) => {
        if (!user) {
          return callback("User not found");
        }

        user.update({
            role: "standard"
          }, {
            where: {
              id: user.id
            }
          })

          .then((user) => {
            callback(null, user);
          })
          .catch((err) => {
            callback(err);
          })
      })
  }
}
