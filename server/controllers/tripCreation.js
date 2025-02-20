const Trip = require('../schemas/tripCreation');
const User = require("../schemas/user");

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

// Get all users (excluding sensitive fields)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password -__v -verified') // Exclude sensitive fields
            .sort({ createdAt: -1 });

        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Accept join request
exports.acceptRequest = async (req, res) => {
    try {
        const { tripId } = req.params;
        const { email } = req.body;

        const trip = await Trip.findById(tripId);
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        if (!trip.requestToJoin.includes(email)) {
            return res.status(400).json({ error: 'User not in join requests' });
        }

        if (trip.seatsAvailable <= 0) {
            return res.status(400).json({ error: 'No available seats left' });
        }

        // Update trip document
        const updatedTrip = await Trip.findByIdAndUpdate(
            tripId,
            {
                $pull: { requestToJoin: email },
                $push: { acceptedRequest: email },
                $inc: { seatsAvailable: -1 }
            },
            { new: true }
        );

        res.json({
            message: 'Request accepted successfully',
            trip: updatedTrip
        });
    } catch (error) {
        console.error('Error accepting request:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Reject join request
exports.rejectRequest = async (req, res) => {
    try {
        const { tripId } = req.params;
        const { email } = req.body;

        const trip = await Trip.findById(tripId);
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        if (!trip.requestToJoin.includes(email)) {
            return res.status(400).json({ error: 'User not in join requests' });
        }

        // Update trip document
        const updatedTrip = await Trip.findByIdAndUpdate(
            tripId,
            {
                $pull: { requestToJoin: email }
            },
            { new: true }
        );

        res.json({
            message: 'Request rejected successfully',
            trip: updatedTrip
        });
    } catch (error) {
        console.error('Error rejecting request:', error);
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


exports.updateTrip = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
     

        // Validate allowed updates
        const allowedUpdates = ['from', 'to', 'departure', 'cost', 'seatsAvailable'];
        const isValidOperation = Object.keys(updates).every(update => 
            allowedUpdates.includes(update)
        );

        if (!isValidOperation) {
            return res.status(400).json({ error: 'Invalid updates!' });
        }

        const trip = await Trip.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true
        });

        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        res.json(trip);
    } catch (error) {
        console.error('Error updating trip:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};