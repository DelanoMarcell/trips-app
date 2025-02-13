const express = require("express");
const router = express.Router();

const tripCreationController = require("../controllers/tripCreation");

router.post("/tripcreate", (req, res) => tripCreationController.createTrip(req, res));
router.get("/tripsavailable", (req, res) => tripCreationController.tripsavailable(req, res));
router.post("/triprequest", (req, res) => tripCreationController.tripRequest(req, res));
router.get("/trisummary", (req, res) => tripCreationController.tripsummary(req, res));
router.get("/trireqsummary", (req, res) => tripCreationController.tripreqsummary(req, res));


module.exports = router;
