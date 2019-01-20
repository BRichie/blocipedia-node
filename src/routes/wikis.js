const express = require("express");
const router = express.Router();
const helper = require('../auth/helpers');

const wikiController = require("../controllers/wikiController")

router.get("/wikis", wikiController.index);
router.get("/wikis/private", wikiController.private); 
router.get("/wikis/new",helper.ensureAuthenticated, wikiController.new);

router.post("/wikis/create",helper.ensureAuthenticated, wikiController.create);
router.get("/wikis/:id", wikiController.show);
router.post("/wikis/:id/destroy", wikiController.destroy);
router.get("/wikis/:id/edit", helper.ensureAuthenticated, wikiController.edit);
router.post("/wikis/:id/update",wikiController.update);


module.exports = router;