const User = require("./models").User;
const bcrypt = require("bcryptjs");
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


module.exports = {

  createUser(newUser, callback){
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

    return User.create({
      username: newUser.username,
      email: newUser.email,
      password: hashedPassword
    })
    .then((user) => {

      const msg = {
        to: newUser.email,
        from: 'lebron@lakeshow.com',
        subject: 'Salutations from Blocipedia',
        text: 'Thank you for joining our online community',
        html: '<strong>Start sharing!</strong>',
      };
      //console.log(msg);
      sgMail.send(msg);
        callback(null, user);
    })
    .catch((err) => {
      callback(err);
      console.log(err);
    })
  }
}
