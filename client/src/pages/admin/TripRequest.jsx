import SideNav from "../../components/admin_only/Sidebar";
import './TripRequest.module.css';
import { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import styles from './TripRequest.module.css';

function TripRequest() {
    const [trips, setTrips] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch trips with join requests
        fetch('http://localhost:5000/api/trips/getalltrips')
            .then(response => response.json())
            .then(data => setTrips(data))
            .catch(error => console.error('Error fetching trips:', error));

        // Fetch all users
        fetch('http://localhost:5000/api/trips/getAllUsers')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching users:', error));

    }, []);

    // Combine trips and users data to get request details
    const getRequests = () => {
        return trips.flatMap(trip => 
            trip.requestToJoin.map(requestEmail => {
                
                const user = users.find(u => u.email === requestEmail);
                return {
                    tripId: trip._id,
                    email: requestEmail,
                    name: user ? `${user.name} ${user.surname}` : 'Unknown User',
                    tripDetails: {
                        from: trip.from,
                        to: trip.to,
                        departure: trip.departure,
                        cost: trip.cost
                    }
                };
            })
        );
    };

    const handleAccept = (tripId, email) => {
        // API call to accept request
        fetch(`http://localhost:5000/api/trips/${tripId}/accept-request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        })
        .then(response => {
            if (response.ok) {
                // Update state to remove the accepted request
                setTrips(prevTrips => prevTrips.map(trip => {
                    if (trip._id === tripId) {
                        return {
                            ...trip,
                            requestToJoin: trip.requestToJoin.filter(e => e !== email),
                            acceptedRequest: [...trip.acceptedRequest, email]
                        };
                    }
                    return trip;
                }));
            }
        })
        .catch(error => console.error('Error accepting request:', error));
    };

    const handleReject = (tripId, email) => {
        // API call to reject request
        fetch(`http://localhost:5000/api/trips/${tripId}/reject-request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        })
        .then(response => {
            if (response.ok) {
                // Update state to remove the rejected request
                setTrips(prevTrips => prevTrips.map(trip => {
                    if (trip._id === tripId) {
                        return {
                            ...trip,
                            requestToJoin: trip.requestToJoin.filter(e => e !== email)
                        };
                    }
                    return trip;
                }));
            }
        })
        .catch(error => console.error('Error rejecting request:', error));
    };

    return (
        <div className={styles.pageContainer}>
            <SideNav className={styles.sidebar} />
            <div className={styles.requestContainer}>
                {getRequests().map((request, index) => (
                    <div key={`${request.tripId}-${request.email}-${index}`} className={styles.requestItem}>
                        <FaUser className={styles.userIcon} />
                        <div className={styles.userDetails}>
                            <h3>{request.name}</h3>
                            <p>{request.email}</p>
                            <div className={styles.tripDetails}>
                                <span>From: {request.tripDetails.from}</span>
                                <span>To: {request.tripDetails.to}</span>
                                <span>Departure: {new Date(request.tripDetails.departure).toLocaleString()}</span>
                                <span>Cost: R{request.tripDetails.cost}</span>
                            </div>
                        </div>
                        <div className={styles.buttonGroup}>
                            <button 
                                onClick={() => handleAccept(request.tripId, request.email)}
                                className={styles.acceptButton}
                            >
                                Accept
                            </button>
                            <button 
                                onClick={() => handleReject(request.tripId, request.email)}
                                className={styles.rejectButton}
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TripRequest;