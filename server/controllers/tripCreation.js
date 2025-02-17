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
    try {
        const admin = req.query.admin;
        
        if (!admin) {
            return res.status(400).json({ 
                error: 'Admin email is required' 
            });
        }

        const trips = await Trip.find({ 
            tripBy: admin,
        }).select('-__v')  
          .sort({ date: 1 });  

        res.json(trips);

    } catch (error) {
        console.error('Error fetching trips:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }   
};

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


