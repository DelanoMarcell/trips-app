const express = require("express");
const router = express.Router();

const tripCreationController = require("../controllers/tripCreation");

router.post("/tripcreate", (req, res) => tripCreationController.createTrip(req, res));
router.get("/tripupdate", (req, res) => tripCreationController.test(req, res));


module.exports = router;
