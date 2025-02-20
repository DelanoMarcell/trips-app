import React, { useState, useEffect } from "react";
import { FiMapPin, FiClock, FiUser, FiMail } from 'react-icons/fi';
import SideNav from "../../components/admin_only/Sidebar";
import styles from './Dashboard.module.css';
import Cookies from 'js-cookie';

function Dashboard() {
  const adminKey = Cookies.get('email');
  const [rides, setRides] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [error, setError] = useState(null);

  // Function to fetch active rides and process join requests
  async function fetchData() {
    try {
      const response = await fetch(`/api/trips/tripsavailable?admin=${adminKey}`);
      if (!response.ok) {
        throw new Error('Failed to fetch trips');
      }
      const data = await response.json();
      setRides(data);  // Update rides state
      
      // Process join requests from all rides
      const allRequests = [];
      data.forEach(ride => {
        if (ride.requestToJoin && ride.requestToJoin.length > 0) {
          ride.requestToJoin.forEach(request => {
            allRequests.push({
              id: request.id || `${ride.id}-${Math.random().toString(36).substr(2, 9)}`,
              user: request.name || 'User',
              email: request.email || 'No email provided',
              rideId: ride.id
            });
          });
        }
      });
      
      // Get the most recent join requests (limited to 5)
      const recentRequests = allRequests.slice(0, 5);
      setJoinRequests(recentRequests);
      
    } catch (error) {
      setError(error.message);
    }
  }

  useEffect(() => {
    fetchData();
    // Set up a refresh interval (every 2 minutes)
    const interval = setInterval(fetchData, 120000);
    return () => clearInterval(interval); // Clean up on component unmount
  }, []);

  const handleRequestAction = (requestId, action) => {
    // Handle accept/decline logic here
    // You would typically make an API call to update the status
    
    // For now, just remove from the UI
    setJoinRequests(joinRequests.filter(request => request.id !== requestId));
    
    // Here you would add the actual API call to update the request status
    // Example:
    // if (action === 'accept') {
    //   fetch(`http://localhost:5000/api/trips/acceptRequest/${requestId}?admin=${adminKey}`, {
    //     method: 'POST'
    //   });
    // } else {
    //   fetch(`http://localhost:5000/api/trips/rejectRequest/${requestId}?admin=${adminKey}`, {
    //     method: 'POST'
    //   });
    // }
  };

  return (
    <div className={styles.dashboardContainer}>
      <SideNav />
      
      <main className={styles.mainContent}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        
        {error && <div className={styles.errorMessage}>Error: {error}</div>}
        
        <div className={styles.gridContainer}>
          {/* Existing Rides Section */}
          <div className={styles.section}>
            <h2 className="text"><FiMapPin /> Active Rides</h2>
            <div className={styles.ridesGrid}>
              {rides.length > 0 ? (
                rides.map(ride => (
                  <div key={ride.id} className={styles.rideCard}>
                    <div className={styles.rideHeader}>
                      <span className={styles.statusIndicator} data-status={ride.status} />
                      <h3 className="text">{ride.from} → {ride.to}</h3>
                    </div>
                    <div className={styles.rideDetails}>
                      <p className="text"><FiClock /> {ride.departure}</p>
                      <p className="text">Seats available: {ride.seatsAvailable}</p>
                      <p className="text">Cost: R{ride.cost}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No active rides found.</p>
              )}
            </div>
          </div>

          {/* Join Requests Section */}
       
        </div>
      </main>
    </div>
  );
}

export default Dashboard;