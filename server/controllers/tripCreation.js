const Trip = require('../schemas/tripCreation');

exports.createTrip = async (req, res) => {

    
    try{
        const {tripBy, tripName, from, to, departure, cost, seatsAvailable, joinRequest, acceptedRequest} = req.body;

        //connect and save to mongoDB
        const newTrip = new Trip({
            tripBy,
            tripName,
            from,
            to,
            departure,
            cost,
            seatsAvailable,
            joinRequest,
            acceptedRequest,
        });

        await newTrip.save();


        res.send("done")

    } catch (e) {
        console.error(e.message);
    }

}

exports.tripsavailable = async (req, res) => {

    try{
        const admin = "admin"

        const trips = await Trip.find({tripBy: admin});

        res.json(trips);

    } catch (e) {
        console.error(e.message);
    }   

}

exports.tripRequest = async (req, res) => {

    try{

        //receives userID AND tripID
        //sets the userID to the trip request array
        
        const {userID, tripID} = req.body;

        const trip = await Trip.findById(tripID);
        console.log(trip);

        trip.requestToJoin.push(userID);

        console.log(trip);
        await trip.save();

        res.send("done");

    } catch (e) {
        console.error(e.message);
    }

}
