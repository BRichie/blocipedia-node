const User = require("./models").User;
const Collaborator = require("./models").Collaborator;
const Wiki = require("./models").Wiki;
const bcrypt = require("bcryptjs");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


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
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);


        const msg = {
          to: newUser.email,
          from: 'brandoncrichie@gmail.com',
          subject: 'User Confirmation',
          text: 'Salutations for signing up for a Blocipedia account.',
          html: '<strong>Thank you for joining!</strong>',
        };
        sgMail.send(msg);
        callback(null, user);
      })

      .catch((err) => {
        callback(err);
      });
  },

  /*   getAllUsers(callback) {
      let result = {};
      return User.all()
        .then(users => {
          result['users'] = users;
          callback(null, result);
        })
        .catch((err) => {
          callback(err);
        })
      }, */

  getUser(id, callback) {
    let result = {};
    User.findById(id).then(user => {
      if (!user) {
        callback(404);
      } else {
        result["user"] = user;
        Collaborator.scope({
            method: ["userCollaborationsFor", id]
          })
          .all()
          .then((collaborations) => {
            result["collaborations"] = collaborations;
            callback(null, result);
          })
          .catch((err) => {
            callback(err);
          });
      }
    });
  },

  upgrade(req, callback) {
    return User.findById(req.params.id)
      .then((user) => {
        if (!user) {
          return callback("404");
        }
        user.update({
            role: 'premium'
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
  },

  downgrade(req, callback) {
    return User.findById(req.params.id)
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
};