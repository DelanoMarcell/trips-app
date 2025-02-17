import React, { useState } from "react";
import { FiMapPin, FiClock, FiUser, FiMail } from 'react-icons/fi';
import SideNav from "../../components/admin_only/Sidebar";
import styles from './Dashboard.module.css';
import Cookies from 'js-cookie';
import { useEffect } from "react";


function Dashboard() {

  //fetch data from the API
  const adminKey = Cookies.get('email');



    const [rides, setRides] = useState([]);
  const [error, setError] = useState(null);
  const [joinRequests, setJoinRequests] = useState([]); // State to store join requests
  const [joinErr, setJoinErr] = useState(null);  // State to store join requests error

  // Function to fetch active rides
  async function getActiveRides() {
    
    try {
      const response = await fetch(`http://localhost:5000/api/trips/tripsavailable?admin=${adminKey}`);
      if (!response.ok) {
        throw new Error('Failed to fetch trips');
      }
      const data = await response.json();
      setRides(data);  // Update the state with the fetched data
      let riders = data.map(ride => ride.requestToJoin);
    } catch (error) {
      setError(error.message);  // Set error if the fetch fails
    }
  }

  useEffect(() => {
    getActiveRides();
  }, []);  // Empty dependency array to run only once when the component mounts

  




  //get 3 most frequent requests to join a ride
  async function getJoinRequets() {
    
    try {
      const response = await fetch(`http://localhost:5000/api/trips/tripsavailable?admin=${adminKey}`);
      if (!response.ok) {
        throw new Error('Failed to fetch trips');
      }
      const data = await response.json();
      setJoinRequests(data);  // Update the state with the fetched data
      console.log(data);
    } catch (error) {
      setJoinErr(error.message);  // Set error if the fetch fails
    }
  }

  useEffect(() => {
    getJoinRequets();
  }, []); 

  

  const [requests, setRequests] = useState([
    {
      id: 1,
      user: 'User 1',
      email: 'useremail',
      rideId: 1,
    }
  
  ]);

  const handleRequestAction = (requestId, action) => {
    setRequests(requests.filter(request => request.id !== requestId));

    
  };

  return (
    <div className={styles.dashboardContainer}>
      <SideNav />
      
      <main className={styles.mainContent}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        
        <div className={styles.gridContainer}>
          {/* Existing Rides Section */}
          <div className={styles.section}>
            <h2 className="text"><FiMapPin /> Active Rides</h2>
            <div className={styles.ridesGrid}>
              {rides.map(ride => (
                <div key={ride.id} className={styles.rideCard}>
                  <div className={styles.rideHeader}>
                    <span className={styles.statusIndicator} data-status={ride.status} />
                    <h3 className="text">{ride.from} → {ride.to}</h3>
                  </div>
                  <div className={styles.rideDetails}>
                    <p className="text"><FiClock /> {ride.departure} </p>
                    <p className="text">Seats available: {ride.seatsAvailable}</p>
                    <p className="text">Cost: R{ride.cost}</p>

                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Join Requests Section */}
          <div className={styles.section}>
            <h2><FiUser /> Join Requests</h2>
            <div className={styles.requestsList}>
              {requests.map(request => (
                <div key={request.id} className={styles.requestCard}>
                  <div className={styles.requestHeader}>
                    <FiUser className={styles.userIcon} />
                    <div>
                      <h3>{request.user}</h3>
                      <p><FiMail /> {request.email}</p>
                    </div>
                  </div>
                  <div className={styles.rideReference}>
                    Requesting ride #{request.rideId}
                  </div>
                  <div className={styles.actionButtons}>
                    <button 
                      onClick={() => handleRequestAction(request.id, 'accept')}
                      className={styles.acceptButton}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRequestAction(request.id, 'decline')}
                      className={styles.declineButton}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
export default Dashboard;