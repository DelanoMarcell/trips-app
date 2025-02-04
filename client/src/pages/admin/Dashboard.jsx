import React, { useState } from "react";
import { FiMapPin, FiClock, FiUser, FiMail } from 'react-icons/fi';
import SideNav from "../../components/admin_only/Sidebar";
import styles from './Dashboard.module.css';

function Dashboard() {
  // Mock data - replace with API calls
  const [rides, setRides] = useState([
    {
      id: 1,
      start: 'From',
      end: 'To',
      date: '2024-03-20',
      time: '08:00 AM',
      driver: 'John Doe',
      seats: 3,
      status: 'active'
    }

  ]);

  const [requests, setRequests] = useState([
    {
      id: 1,
      user: 'User 1',
      email: 'useremail',
      rideId: 1,
      message: 'Can I join with 2 luggage items?'
    }
  
  ]);

  const handleRequestAction = (requestId, action) => {
    setRequests(requests.filter(request => request.id !== requestId));
    // Add API call here to handle the action
  };

  return (
    <div className={styles.dashboardContainer}>
      <SideNav />
      
      <main className={styles.mainContent}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        
        <div className={styles.gridContainer}>
          {/* Existing Rides Section */}
          <div className={styles.section}>
            <h2><FiMapPin /> Active Rides</h2>
            <div className={styles.ridesGrid}>
              {rides.map(ride => (
                <div key={ride.id} className={styles.rideCard}>
                  <div className={styles.rideHeader}>
                    <span className={styles.statusIndicator} data-status={ride.status} />
                    <h3>{ride.start} → {ride.end}</h3>
                  </div>
                  <div className={styles.rideDetails}>
                    <p><FiClock /> {ride.date} at {ride.time}</p>
                    <p>Seats available: {ride.seats}</p>
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