const express = require("express");
const router = express.Router();

const tripCreationController = require("../controllers/tripCreation");

router.post("/tripcreate", (req, res) => tripCreationController.createTrip(req, res));
router.get("/tripsavailable", (req, res) => tripCreationController.tripsavailable(req, res));
router.post("/triprequest", (req, res) => tripCreationController.tripRequest(req, res));
router.get("/trisummary", (req, res) => tripCreationController.tripsummary(req, res));
router.get("/trireqsummary", (req, res) => tripCreationController.tripreqsummary(req, res));
router.get("/getalltrips", (req, res) => tripCreationController.getalltrips(req, res));
router.get("/requestedtrips", (req, res) => tripCreationController.requestedTrips(req, res));
router.get("/admintrips", (req, res) => tripCreationController.admintrips(req, res));
router.put("/updatetrip", (req, res) => tripCreationController.updateTrip(req, res));
router.post('/:tripId/accept-request', tripCreationController.acceptRequest);
router.post('/:tripId/reject-request', tripCreationController.rejectRequest);
router.get("/getAllUsers",(req, res) => tripCreationController.getAllUsers(req, res))
module.exports = router;
