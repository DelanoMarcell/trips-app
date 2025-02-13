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

