const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;



describe("Wiki", () => {

  beforeEach((done) => {
    this.wiki;
    this.user;

    sequelize.sync({
        force: true
      }).then((res) => {

        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
  });


  describe("#create()", () => {

    it("should create a wiki with a title, body, and private status", (done) => {
      Wiki.create({
          title: "Kanye",
          body: "Weird Dude, Great Rapper",
          private: false,


        })
        .then((wiki) => {
          expect(wiki.title).toBe("Kanye");
          expect(wiki.body).toBe("Weird Dude, Great Rapper");
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
    });
    //   it("should not create a wiki with a title already taken", (done) => {
    //     Wiki.create({
    //       title: "Empty title"
    //   })
    //     .then((wiki) => {
    //       done();
    //     })
    //     .catch((err) => {
    //       expect(err.message).toContain("Wiki.body cannot be null");
    //       expect(err.message).toContain("Wiki.userId cannot be null");
    //       done();
    //     });
    //   });
    // });

    // describe("#setUser()", () => {

    //   it("should associate a wiki and a user together", (done) => {
    //     User.create({
    //         username: "Marshall Mathers",
    //         email: "eminem@gmail.com",
    //         password: "haleyjade"
    //       })
    //       .then((user) => {
    //         this.user = user;

    //         Wiki.create({
    //             title: "Kanye",
    //             body: "Weird Dude, Great Rapper",
    //             private: true,
    //             userId: this.user.id
    //           })
    //           .then((wiki) => {
    //             expect(wiki.userId).toBe(this.user.id);
    //             done();
    //           })
    //           .catch((err) => {
    //             console.log(err);
    //             done();
    //           })
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //         done();
    //       })
    //   });
    // });



  });


});