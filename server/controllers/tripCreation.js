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
            status : [],
        });

        await newTrip.save();


        res.send("done")

    } catch (e) {
        console.error(e.message);
    }

}



//get trips beloging to a specific admin
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


//get all the trips
exports.getalltrips = async (req, res) => {
    try {
        const trips = await Trip.find()
            .select('-__v')  
            .sort({ date: 1 });  

        res.json(trips);
    } catch (error) {
        console.error('Error fetching all trips:', error);
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

        if (trip.requestToJoin.includes(userID)) {
            // If already added, send an error response
            console.log("already added");
            return res.status(400).json({ message: "User has already requested to join this trip." });
        }

        trip.requestToJoin.addToSet(userID);
        trip.status.addToSet("Pending");

        await trip.save();

        res.send("done");

    } catch (e) {
        console.error(e.message);
    }

}



exports.requestedTrips = async (req, res) => {
    try {
        const userID = req.query.userID;

        const trips = await Trip.find({ 
            requestToJoin: { $in: [userID] } // Check if userID is in the requestToJoin array
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