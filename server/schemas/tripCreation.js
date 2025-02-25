const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema({
  tripBy : String,
  tripName: String,
  from : String,
  to: String,
  departure: String,
  cost: Number, // amount in rands without the units
  seatsAvailable: Number,
  requestToJoin : Array,
  acceptedRequest : Array,
  rejectedRequest : Array,
  status : Array,
});

module.exports = mongoose.model("Trip", TripSchema);
