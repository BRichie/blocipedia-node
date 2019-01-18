const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";
const User = require("../../src/db/models").User;
const sequelize = require("../../src/db/models/index").sequelize;

describe("routes : users", () => {

  beforeEach((done) => {

    sequelize.sync({
        force: true
      })
      .then(() => {
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });

  });

  describe("GET /users/sign_up", () => {

    it("should render a view with a sign up form", (done) => {
      request.get(`${base}sign_up`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Sign up");
        done();
      });
    });
  });

  describe("POST /users/sign_up", () => {

    // Confirm that a form with valid values creates a user. 
    it("should create a new user with valid values and redirect", (done) => {

      const options = {
        url: `${base}sign_up`,
        form: {
          username: "kobe",
          email: "kobe@lakers.com",
          password: "passwordtest"
        }
      }

      request.post(options,
        (err, res, body) => {

          // Check the users table for a user with the given email and confirm ID  
          User.findOne({
              where: {
                email: "kobe@lakers.com"
              }
            })
            .then((user) => {
              expect(user).not.toBeNull();
              expect(user.email).toBe("kobe@lakers.com");
              expect(user.id).toBe(1);
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
        }
      );
    });

   
  //   it("should not create a new user with invalid attributes and redirect", (done) => {
  //     const options ={
  //         url: `${base}sign_up`,
  //         form: {
  //           username: "jellybean",
  //           email: "notEmail",
  //           password: "passwordtest"
  //         }
  //       };
  //       request.post(options, (err, res, body) => {
  //         User.findOne({
  //             where: {
  //               email: "notEmail"
  //             }
  //           })
  //           .then((user) => {
  //             expect(user).toBeNull();
  //             done();
  //           })
  //           .catch((err) => {
  //             console.log(err);
  //             done();
  //           });
  //       });
  //   });
  // });

    describe("GET /users/sign_in", () => {

      it("should render a view with a sign in form", (done) => {
        request.get(`${base}sign_in`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Sign in");
          done();
        });
      });
    });
  });
})
