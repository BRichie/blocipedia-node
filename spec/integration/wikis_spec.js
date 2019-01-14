const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("routes : wikis", () => {

  beforeEach((done) => {
    this.wiki;
    this.user;

    sequelize.sync({force: true}).then((res) => {
      User.create({
        username: 'kobe',
        email: "kobe@lakers.com",
        password: "1234567",
  
      })
      .then((user)=>{
        this.user = user;

        Wiki.create({
          title: "Hardwood Greats",
          body: "Basketball Legends",
          private: false,
          userId: this.user.id
        })
         .then((wiki) => {
           this.wiki = wiki;
           done();
         })
         .catch((err) => {
          console.log(err);
          done();
         });
      })
    });
  });

  describe("user performing CRUD actions for Wiki", () => {

    beforeEach((done) => {
      User.create({
        username: "Carlo",
        email: "carlito@way.com",
        password: "1234567"
      })
      .then((user) => {
        request.get({
            url: "http://localhost:3000/auth/fake",
            form: {
              username: user.username,
              userId: user.id,
              email: user.email
            }
          },
          (err, res, body) => {
            done();
          });
      })
    });
  
    describe("GET /wikis", () => {
    it("should return all wikis", (done) => {
        request.get(base, (err, res, body) => {
          expect(err).toBeNull();
           expect(body).toContain("Wikis");
           expect(body).toContain("Hardwood Greats");
          done();
        });
      });
    });
    
    describe("GET /wikis/new", () => {

      it("should render a new wiki form", (done) => {
        request.get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("New Wiki");
          done();
        });
      });
    });

    describe("POST /wikis/create", () => {
      const options = {
        url: `${base}create`,
        form: {
          title: "Tom Cruise",
          body: "What's your favorite Tom Cruise movie?",
        
        }
      };
      it("should create a new wiki and redirect", (done) => {
        request.post(options, (err, res, body) => {
            Wiki.findOne({where: {title: "Tom Cruise"}})
            .then((wiki) => {
              expect(res.statusCode).toBe(303);
              expect(wiki.title).toBe("Tom Cruise");
              expect(wiki.body).toBe("What's your favorite Tom Cruise movie?");
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
          });
      });
    });

    describe("GET /wikis/:id", () => {

      it("should render a view with the selected wiki", (done) => {
        request.get(`${base}${this.wiki.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Hardwood Greats");
          done();
        });
      });
    });
  
    describe("POST /wikis/:id/destroy", () => {
  
      it("should delete the wiki with the associated ID", (done) => {
        Wiki.all()
        .then((wikis) => {
          const wikiCount = wikis.length;
          expect(wikiCount).toBe(1);
          request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
            Wiki.all()
            .then((wikis) => {
              expect(err).toBeNull();
              expect(wikis.length).toBe(wikiCount - 1);
              done();
            })
          });
        });
      });
    });

    describe("GET /wikis/:id/edit", () => {

      it("should render a view with an edit wiki form", (done) => {
        request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Edit Wiki");
          expect(body).toContain("Hardwood Greats");
          done();
        });
      });
    });
  
    describe("POST /wikis/:id/update", () => {
  
     it("should update the wiki with the given values", (done) => {
        const options = {
           url: `${base}${this.wiki.id}/update`,
           form: {
             title: "Hardwood Greats",
             body: "Basketball Legends"
           }
         };
         request.post(options, (err, res, body) => {
           expect(err).toBeNull();
           Wiki.findOne({
             where: { id: this.wiki.id }
           })
           .then((wiki) => {
             expect(wiki.title).toBe("Hardwood Greats");
             done();
           });
         });
     });
   });
  
  })//End of test for user
  
  });



